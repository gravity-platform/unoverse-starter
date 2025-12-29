/**
 * Gravity Auth - Provider-Agnostic OIDC Authentication
 * Works with: Auth0, Keycloak, Azure AD, Cognito, etc.
 * Uses oauth4webapi for lightweight, framework-agnostic auth
 */

export { GravityAuthProvider, type GravityAuthConfig } from "./GravityAuthProvider";
export { useGravityAuth, type GravityUser, type GravityAuthState } from "./useGravityAuth";
export { createOAuthClient, type OAuthConfig, type OAuthUser, type OAuthClient } from "./oauth-client";
