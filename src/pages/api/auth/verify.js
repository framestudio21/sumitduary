import { jwtVerify } from "jose";

export const config = {
  runtime: "edge", // Ensure you're using the Edge runtime
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405 }
    );
  }

  try {
    const { token } = await req.json();

    // Decode the JWT using jose
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "e8ad46188b56c0b64a9b58262a0e114f8f777bee4e0ff35b7b5f72dda5786f40")
    );

    // Return the decoded payload if verification is successful
    return new Response(JSON.stringify({ valid: true, decoded: payload }), {
      status: 200,
    });
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Invalid token" }),
      { status: 401 }
    );
  }
}
