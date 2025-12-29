/**
 * GravityAuthProvider - Provider-Agnostic OIDC Authentication
 * Works with: Auth0, Keycloak, Azure AD, Cognito, etc.
 * Uses oauth4webapi for lightweight, framework-agnostic auth
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createOAuthClient, type OAuthConfig, type OAuthUser, type OAuthClient } from "./oauth-client";

export interface GravityAuthConfig {
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

export interface GravityAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: OAuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const GravityAuthContext = createContext<GravityAuthContextValue | null>(null);

interface GravityAuthProviderProps {
  config: GravityAuthConfig;
  children: ReactNode;
}

export function GravityAuthProvider({ config, children }: GravityAuthProviderProps) {
  const [client] = useState<OAuthClient>(() =>
    createOAuthClient({
      issuer: config.issuer,
      clientId: config.clientId,
      audience: config.audience,
      redirectUri: config.redirectUri,
      scope: config.scope,
    })
  );

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<OAuthUser | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // Check if this is a callback from the auth server
        const callbackUser = await client.handleCallback();
        if (callbackUser) {
          setUser(callbackUser);
          setIsLoading(false);
          return;
        }

        // Check for existing session
        const existingUser = client.getUser();
        setUser(existingUser);
      } catch (error) {
        console.error("[GravityAuthProvider] Init error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [client]);

  const value: GravityAuthContextValue = {
    isAuthenticated: !!user,
    isLoading,
    user,
    login: () => client.login(),
    logout: () => client.logout(),
    getAccessToken: async () => user?.accessToken || null,
  };

  return <GravityAuthContext.Provider value={value}>{children}</GravityAuthContext.Provider>;
}

export function useGravityAuthContext(): GravityAuthContextValue {
  const context = useContext(GravityAuthContext);
  if (!context) {
    throw new Error("useGravityAuthContext must be used within a GravityAuthProvider");
  }
  return context;
}
