import { importMicrofrontend } from './loader'
import { getComponent, getService, addComponent, addService, MicroSharedRegistryItem, Microservice, Microcomponent } from './registry'

// Configuration exports
export { createMicrofrontConfig, generateViteConfig, generateWebpackConfig, generatePackageJson, generateTsConfig, generateManifest, createCliConfig, validateConfig, MicrofrontTemplates, DEFAULT_SHARED_DEPS, DEFAULT_BUILD_CONFIG } from './config'
export type { MicrofrontendConfig, BuildConfig, SharedDependency, ExportDefinition, MicrofrontMetadata, GeneratedConfigs, CliOptions, ValidationResult, TemplateConfig } from './config.types'

// CLI exports
export { createProject, generateConfig, validateProject, listTemplates, parseArgs, main as runCli } from './cli'

export function importMicrofront(url: string, name: string, cb: (result: MicroSharedRegistryItem) => void) {
  const onComplete = () => {
    const component = getComponent(name)
    const service = getService(name)
    cb({ component, service })
  }

  return importMicrofrontend({
    url,
    name,
    onComplete
  })
}

export function exportServices(services: Microservice[]) {
  services.forEach(s => {
    addService(s)
  })
}

// Registry re-exports
export {
  // Dependency functions
  getSharedDependency,
  replaceSharedDependency,
  deleteSharedDependency,
  addSharedDependency,

  // Component functions
  getComponent,
  replaceComponent,
  deleteComponent,
  addComponent,

  // Service functions
  getService,
  replaceService,
  deleteService,
  addService,

  // Registry management functions
  getAllDependencies,
  getAllComponents,
  getAllServices,
  getRegistry,
  clearRegistry,
  hasDependency,
  hasComponent,
  hasService
} from './registry'

export type {
  MicroDependency,
  MicroSharedRegistry,
  MicroSharedRegistryItem
} from './registry.types'

// Events exports
export {
  // Event emitter
  registryEvents,
  RegistryEventEmitter,

  // Event creation helpers
  createDependencyAddedEvent,
  createDependencyUpdatedEvent,
  createDependencyRemovedEvent,
  createComponentAddedEvent,
  createComponentUpdatedEvent,
  createComponentRemovedEvent,
  createServiceAddedEvent,
  createServiceUpdatedEvent,
  createServiceRemovedEvent,
  createRegistryClearedEvent,

  // Debug utilities
  createDebugLogger,

  // Decorator
  withEvents
} from './events'

export type {
  EventType,
  RegistryEvent,
  EventHandler,
  EventSubscription
} from './events'

export function exportComponents(components: Microcomponent[]) {
  components.forEach(c => {
    addComponent(c)
  })
}
