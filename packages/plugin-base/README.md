# @gravityai-dev/plugin-base

Base package for developing Gravity plugins.

## Installation

```bash
npm install @gravityai-dev/plugin-base
```

## Usage

```typescript
import { createPlugin, type GravityPluginAPI } from '@gravityai-dev/plugin-base';

const plugin = createPlugin({
  name: '@gravityai-dev/my-plugin',
  version: '1.0.0',
  description: 'My Gravity plugin',
  
  async setup(api: GravityPluginAPI) {
    // Initialize platform dependencies
    const { initializePlatformFromAPI } = await import('@gravityai-dev/plugin-base');
    initializePlatformFromAPI(api);
    
    // Register nodes, services, credentials
    api.registerNode('MyNode', myNode);
  }
});

export default plugin;
```

## API Reference

### createPlugin(config)
Creates a plugin instance.

### initializePlatformFromAPI(api)
Initializes platform dependencies from the plugin API.

### getPlatformDependencies()
Gets platform dependencies for internal use in nodes and services.

### Types
- `GravityPlugin` - Plugin interface
- `GravityPluginAPI` - API provided to plugins
- `PlatformDependencies` - Platform dependencies interface
