/**
 * TypeScript declarations for CSS Modules
 * Allows importing .module.css files in TypeScript
 */
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}
