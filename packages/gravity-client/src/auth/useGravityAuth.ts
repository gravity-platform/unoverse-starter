/**
 * useGravityAuth - Hook for accessing auth state and methods
 * Uses oauth4webapi via GravityAuthProvider context
 */

import { useGravityAuthContext } from "./GravityAuthProvider";
import type { OAuthUser } from "./oauth-client";

export interface GravityUser {
  /** User ID (sub claim) */
  id: string;
  /** User email */
  email?: string;
  /** User's full name */
  name?: string;
  /** User roles */
  roles: string[];
  /** User permissions (for MCP/tool access) */
  permissions: string[];
  /** Raw OAuth user object */
  raw: OAuthUser;
}

export interface GravityAuthState {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth is still loading */
  isLoading: boolean;
  /** Current user (if authenticated) */
  user: GravityUser | null;
  /** Access token for API calls */
  accessToken: string | null;
  /** Login function */
  login: () => Promise<void>;
  /** Logout function */
  logout: () => Promise<void>;
  /** Get access token (refreshes if needed) */
  getAccessToken: () => Promise<string | null>;
}

export function useGravityAuth(): GravityAuthState {
  const auth = useGravityAuthContext();

  // Map OAuthUser to GravityUser
  const user: GravityUser | null = auth.user
    ? {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        roles: auth.user.roles,
        permissions: auth.user.permissions,
        raw: auth.user,
      }
    : null;

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user,
    accessToken: auth.user?.accessToken || null,
    login: auth.login,
    logout: auth.logout,
    getAccessToken: auth.getAccessToken,
  };
}
