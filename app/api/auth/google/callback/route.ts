import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);
  // The refresh token is deliberately never rendered or logged. Copy it only from
  // the secure authorization response while completing initial setup.
  return NextResponse.json({ success: true, refreshTokenReceived: Boolean(tokens.refresh_token), message: "Google authorization successful. Store the refresh token securely in GOOGLE_REFRESH_TOKEN." });
}
