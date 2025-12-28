/**
 * Shared utilities for mapping Storybook control types
 */

/**
 * Map Storybook control to JSON Schema type
 */
export function mapControlToSchemaType(control: any): string {
  if (!control) return 'string';
  
  const controlType = typeof control === 'string' ? control : control.type;
  
  switch (controlType) {
    case 'text':
    case 'color':
    case 'date':
    case 'select':
      return 'string';
    case 'number':
    case 'range':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'object';
    case 'array':
    case 'multi-select':
      return 'array';
    default:
      return 'string';
  }
}

/**
 * Map Storybook control to TypeScript type
 */
export function mapControlToTsType(control: any): string {
  if (!control) return 'string';
  
  const controlType = typeof control === 'string' ? control : control.type;
  
  switch (controlType) {
    case 'number':
    case 'range':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'object';
    case 'array':
    case 'multi-select':
      return 'any[]';
    default:
      return 'string';
  }
}
