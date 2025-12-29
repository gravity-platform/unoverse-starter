/**
 * OAuth Client using oauth4webapi
 * Provider-agnostic OIDC client that works with Auth0, Azure AD, AWS Cognito, etc.
 */

import * as oauth from "oauth4webapi";

export interface OAuthConfig {
  /** OIDC issuer URL (e.g., https://your-tenant.auth0.com) */
  issuer: string;
  /** Client ID from your OIDC provider */
  clientId: string;
  /** API audience/resource identifier */
  audience?: string;
  /** Redirect URI after login (defaults to current origin) */
  redirectUri?: string;
  /** Scopes to request (defaults to 'openid profile email') */
  scope?: string;
}

export interface OAuthUser {
  id: string;
  email?: string;
  name?: string;
  roles: string[];
  permissions: string[];
  accessToken: string;
  idToken?: string;
  expiresAt?: number;
}

const STORAGE_KEY = "gravity_oauth_user";
const CODE_VERIFIER_KEY = "gravity_oauth_code_verifier";
const STATE_KEY = "gravity_oauth_state";

/**
 * Create an OAuth client instance
 */
export function createOAuthClient(config: OAuthConfig) {
  const redirectUri = config.redirectUri || window.location.origin;
  const scope = config.scope || "openid profile email";

  let authorizationServer: oauth.AuthorizationServer | null = null;
  let client: oauth.Client | null = null;

  /**
   * Initialize the OAuth client by discovering the authorization server
   */
  async function initialize(): Promise<void> {
    if (authorizationServer && client) return;

    const issuerUrl = new URL(config.issuer);
    const response = await oauth.discoveryRequest(issuerUrl);
    authorizationServer = await oauth.processDiscoveryResponse(issuerUrl, response);

    client = {
      client_id: config.clientId,
      token_endpoint_auth_method: "none", // Public client (SPA)
    };
  }

  /**
   * Start the login flow - redirects to the authorization server
   */
  async function login(): Promise<void> {
    await initialize();
    if (!authorizationServer || !client) {
      throw new Error("OAuth client not initialized");
    }

    // Generate PKCE code verifier and challenge
    const codeVerifier = oauth.generateRandomCodeVerifier();
    const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
    const state = oauth.generateRandomState();

    // Store for callback
    sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    sessionStorage.setItem(STATE_KEY, state);

    // Build authorization URL
    const authorizationUrl = new URL(authorizationServer.authorization_endpoint!);
    authorizationUrl.searchParams.set("client_id", config.clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", scope);
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");

    // Add audience for Auth0 (and other providers that support it)
    if (config.audience) {
      authorizationUrl.searchParams.set("audience", config.audience);
    }

    console.log("[oauth-client] Redirecting to:", authorizationUrl.toString());
    window.location.href = authorizationUrl.toString();
  }

  /**
   * Handle the callback after authorization
   */
  async function handleCallback(): Promise<OAuthUser | null> {
    const currentUrl = new URL(window.location.href);
    const code = currentUrl.searchParams.get("code");
    const error = currentUrl.searchParams.get("error");

    if (error) {
      console.error("[oauth-client] Authorization error:", error, currentUrl.searchParams.get("error_description"));
      window.history.replaceState({}, document.title, window.location.pathname);
      return null;
    }

    if (!code) {
      return null; // Not a callback
    }

    const storedState = sessionStorage.getItem(STATE_KEY);
    const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);

    if (!storedState) {
      console.error("[oauth-client] Missing stored state");
      window.history.replaceState({}, document.title, window.location.pathname);
      return null;
    }

    if (!codeVerifier) {
      console.error("[oauth-client] Missing code verifier");
      window.history.replaceState({}, document.title, window.location.pathname);
      return null;
    }

    await initialize();
    if (!authorizationServer || !client) {
      throw new Error("OAuth client not initialized");
    }

    // Validate the authorization response using oauth4webapi
    console.log("[oauth-client] Validating auth response...");
    console.log("[oauth-client] currentUrl:", currentUrl.toString());
    console.log("[oauth-client] storedState:", storedState);

    let callbackParams: URLSearchParams;
    try {
      callbackParams = oauth.validateAuthResponse(authorizationServer, client, currentUrl, storedState);
      console.log("[oauth-client] validateAuthResponse succeeded, callbackParams:", callbackParams);
    } catch (err) {
      console.error("[oauth-client] Validation error:", err);
      window.history.replaceState({}, document.title, window.location.pathname);
      return null;
    }

    // Exchange code for tokens (using None for public client authentication)
    const response = await oauth.authorizationCodeGrantRequest(
      authorizationServer,
      client,
      oauth.None(),
      callbackParams,
      redirectUri,
      codeVerifier
    );

    let result: oauth.TokenEndpointResponse;
    try {
      result = await oauth.processAuthorizationCodeResponse(authorizationServer, client, response);
    } catch (err) {
      console.error("[oauth-client] Token error:", err);
      window.history.replaceState({}, document.title, window.location.pathname);
      return null;
    }

    // Clean up
    sessionStorage.removeItem(CODE_VERIFIER_KEY);
    sessionStorage.removeItem(STATE_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);

    // Parse user from tokens
    const user = parseUser(result);
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  }

  /**
   * Parse user info from token response
   */
  function parseUser(tokens: oauth.TokenEndpointResponse): OAuthUser | null {
    const accessToken = tokens.access_token;
    const idToken = tokens.id_token;

    if (!accessToken) return null;

    // Decode ID token to get user info (if available)
    let profile: any = {};
    if (idToken) {
      try {
        const payload = idToken.split(".")[1];
        profile = JSON.parse(atob(payload));
      } catch (e) {
        console.warn("[oauth-client] Failed to decode ID token");
      }
    }

    return {
      id: profile.sub || "unknown",
      email: profile.email,
      name: profile.name,
      roles: parseArrayClaim(profile, "roles"),
      permissions: parseArrayClaim(profile, "permissions"),
      accessToken,
      idToken,
      expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
    };
  }

  /**
   * Parse array claims from JWT (handles namespaced claims like Auth0)
   */
  function parseArrayClaim(profile: any, claimName: string): string[] {
    if (Array.isArray(profile[claimName])) {
      return profile[claimName];
    }

    const namespacedKey = Object.keys(profile).find(
      (key) => key.endsWith(`/${claimName}`) || key.endsWith(`/claims/${claimName}`)
    );

    if (namespacedKey && Array.isArray(profile[namespacedKey])) {
      return profile[namespacedKey];
    }

    return [];
  }

  /**
   * Get the current user from storage
   */
  function getUser(): OAuthUser | null {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      const user = JSON.parse(stored) as OAuthUser;
      // Check if expired
      if (user.expiresAt && Date.now() > user.expiresAt) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Logout - clear stored user and optionally redirect to logout endpoint
   */
  async function logout(): Promise<void> {
    sessionStorage.removeItem(STORAGE_KEY);

    await initialize();
    if (authorizationServer?.end_session_endpoint) {
      const logoutUrl = new URL(authorizationServer.end_session_endpoint);
      logoutUrl.searchParams.set("client_id", config.clientId);
      logoutUrl.searchParams.set("returnTo", redirectUri);
      logoutUrl.searchParams.set("post_logout_redirect_uri", redirectUri);
      window.location.href = logoutUrl.toString();
    } else {
      // Just reload the page if no logout endpoint
      window.location.href = redirectUri;
    }
  }

  return {
    login,
    logout,
    handleCallback,
    getUser,
    initialize,
  };
}

export type OAuthClient = ReturnType<typeof createOAuthClient>;
