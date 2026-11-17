// Demo-only session. The cookie is a fixed demonstration marker, not an
// authenticated production session. There is no JWT signing secret and no
// database-backed account lookup.

export const SESSION_COOKIE = "al_demo_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

const DEMO_TOKEN = "arthaledger-demo-session-v1";

export const DEMO_SESSION_PAYLOAD: SessionPayload = {
  sub: "demo-admin",
  email: "demo@arthaledger.example",
  name: "Demo Administrator",
  role: "SUPER_ADMIN",
};

export async function signSession(_payload: SessionPayload) {
  return DEMO_TOKEN;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  return token === DEMO_TOKEN ? DEMO_SESSION_PAYLOAD : null;
}
