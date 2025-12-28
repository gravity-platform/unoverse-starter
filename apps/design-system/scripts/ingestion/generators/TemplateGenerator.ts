import type { ComponentMetadata } from "../ComponentScanner";

/**
 * Generate service/templates.ts file
 * Only generates componentUrl - CSS/HTML are bundled in the React component
 */
export function generateTemplates(
  metadata: ComponentMetadata, 
  html: string, 
  css: string,
  componentUrl: string
): string {
  return `/**
 * ${metadata.name} Template Service
 * Auto-generated from Storybook component
 */

import { ${metadata.name}Template } from "../util/types";

export function loadDefaultTemplate(): ${metadata.name}Template {
  return {
    componentUrl: '${componentUrl}',
  };
}

export function loadTemplateByVersion(version: string): ${metadata.name}Template {
  return loadDefaultTemplate();
}

export function loadTemplateForUser(userId: string): ${metadata.name}Template {
  return loadDefaultTemplate();
}
`;
}
