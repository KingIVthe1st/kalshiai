/**
 * Cloudflare Pages Function to proxy Kalshi API requests
 * Handles CORS, authentication, and request signing using RSA-PSS
 */

const KALSHI_API_URL = "https://api.elections.kalshi.com/trade-api/v2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

interface Env {
  KALSHI_API_KEY_ID: string;
  KALSHI_PRIVATE_KEY: string;
}

/**
 * Import RSA private key for signing
 */
async function importPrivateKey(pemKey: string): Promise<CryptoKey> {
  // Remove PEM headers and decode base64
  const pemContents = pemKey
    .replace("-----BEGIN RSA PRIVATE KEY-----", "")
    .replace("-----END RSA PRIVATE KEY-----", "")
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  // Try PKCS8 first, then fall back to PKCS1
  try {
    return await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );
  } catch {
    // For PKCS#1 format (RSA PRIVATE KEY), we need to convert to PKCS#8
    // This is a simplified approach - wrap PKCS#1 in PKCS#8 structure
    const pkcs8Header = new Uint8Array([
      0x30, 0x82, // SEQUENCE
      (binaryDer.length + 26) >> 8, (binaryDer.length + 26) & 0xff,
      0x02, 0x01, 0x00, // INTEGER version = 0
      0x30, 0x0d, // SEQUENCE (AlgorithmIdentifier)
      0x06, 0x09, // OID
      0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, // rsaEncryption
      0x05, 0x00, // NULL
      0x04, 0x82, // OCTET STRING
      (binaryDer.length) >> 8, (binaryDer.length) & 0xff,
    ]);

    const pkcs8Der = new Uint8Array(pkcs8Header.length + binaryDer.length);
    pkcs8Der.set(pkcs8Header);
    pkcs8Der.set(binaryDer, pkcs8Header.length);

    return await crypto.subtle.importKey(
      "pkcs8",
      pkcs8Der,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );
  }
}

/**
 * Sign a message using RSA-PSS with SHA-256
 */
async function signMessage(privateKey: CryptoKey, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const signature = await crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32, // SHA-256 hash length
    },
    privateKey,
    data
  );

  // Convert to base64
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Generate Kalshi authentication headers
 */
async function getAuthHeaders(
  method: string,
  path: string,
  apiKeyId: string,
  privateKeyPem: string
): Promise<Record<string, string>> {
  const timestamp = Date.now().toString();

  // Message format: timestamp + method + path (without query params)
  const pathWithoutQuery = path.split("?")[0];
  const message = `${timestamp}${method}${pathWithoutQuery}`;

  const privateKey = await importPrivateKey(privateKeyPem);
  const signature = await signMessage(privateKey, message);

  return {
    "KALSHI-ACCESS-KEY": apiKeyId,
    "KALSHI-ACCESS-TIMESTAMP": timestamp,
    "KALSHI-ACCESS-SIGNATURE": signature,
  };
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { KALSHI_API_KEY_ID, KALSHI_PRIVATE_KEY } = context.env;

    // Get the path after /api/kalshi/
    const url = new URL(context.request.url);
    const pathParts = url.pathname.replace("/api/kalshi/", "");
    const fullPath = `/trade-api/v2/${pathParts}`;

    // Build the target URL
    const targetUrl = `${KALSHI_API_URL}/${pathParts}${url.search}`;

    // Get authentication headers if credentials are available
    let authHeaders: Record<string, string> = {};
    if (KALSHI_API_KEY_ID && KALSHI_PRIVATE_KEY) {
      authHeaders = await getAuthHeaders("GET", fullPath, KALSHI_API_KEY_ID, KALSHI_PRIVATE_KEY);
    }

    // Forward the request to Kalshi API
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "KalshiAI/1.0",
        ...authHeaders,
      },
    });

    // Get the response body
    const data = await response.text();

    // Return the response with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=10",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch from Kalshi API",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { KALSHI_API_KEY_ID, KALSHI_PRIVATE_KEY } = context.env;

    if (!KALSHI_API_KEY_ID || !KALSHI_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({ error: "API credentials not configured" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(context.request.url);
    const pathParts = url.pathname.replace("/api/kalshi/", "");
    const fullPath = `/trade-api/v2/${pathParts}`;
    const targetUrl = `${KALSHI_API_URL}/${pathParts}${url.search}`;

    const authHeaders = await getAuthHeaders("POST", fullPath, KALSHI_API_KEY_ID, KALSHI_PRIVATE_KEY);
    const body = await context.request.text();

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "KalshiAI/1.0",
        ...authHeaders,
      },
      body,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to post to Kalshi API" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};
