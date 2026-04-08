import type { MicroSharedRegistry, MicroDependency, Microservice, Microcomponent } from './registry.types'
import { withEvents } from './events'
export type { MicroSharedRegistryItem, Microservice, Microcomponent } from './registry.types'
const sharedRegistry: MicroSharedRegistry = {
  dependencies: {},
  components: {},
  services: {}
}

export function getSharedDependency(name: string) {
  return sharedRegistry.dependencies[name]
}

export const replaceSharedDependency = withEvents(
  function replaceSharedDependency(dep: MicroDependency) {
    const oldDep = sharedRegistry.dependencies[dep.name]
    sharedRegistry.dependencies[dep.name] = dep
    return oldDep
  },
  'dependency:updated',
  (dep) => ({ name: dep.name, dependency: dep }),
  'registry'
)

export const deleteSharedDependency = withEvents(
  function deleteSharedDependency(name: string) {
    const dependency = getSharedDependency(name)
    if (dependency) {
      delete sharedRegistry.dependencies[name]
      return dependency
    }
    return null
  },
  'dependency:removed',
  (name) => ({ name, dependency: getSharedDependency(name) }),
  'registry'
)

export const addSharedDependency = withEvents(
  function addSharedDependency(dep: MicroDependency) {
    if (!getSharedDependency(dep.name)) {
      replaceSharedDependency(dep)
      return true
    }
    return false
  },
  'dependency:added',
  (dep) => ({ name: dep.name, dependency: dep }),
  'registry'
)

// Component functions
export function getComponent(name: string) {
  return sharedRegistry.components[name]
}

export const replaceComponent = withEvents(
  function replaceComponent(component: Microcomponent) {
    const oldComponent = sharedRegistry.components[component.name]
    sharedRegistry.components[component.name] = component
    return oldComponent
  },
  'component:updated',
  (component) => ({ name: component.name, component }),
  'registry'
)

export const deleteComponent = withEvents(
  function deleteComponent(name: string) {
    const component = getComponent(name)
    if (component) {
      delete sharedRegistry.components[name]
      return component
    }
    return null
  },
  'component:removed',
  (name) => ({ name, component: getComponent(name) }),
  'registry'
)

export const addComponent = withEvents(
  function addComponent(component: Microcomponent) {
    if (!getComponent(component.name)) {
      replaceComponent(component)
      return true
    }
    return false
  },
  'component:added',
  (component) => ({ name: component.name, component }),
  'registry'
)

// Service functions
export function getService(name: string) {
  return sharedRegistry.services[name]
}

export const replaceService = withEvents(
  function replaceService(service: Microservice) {
    const oldService = sharedRegistry.services[service.name]
    sharedRegistry.services[service.name] = service
    return oldService
  },
  'service:updated',
  (service) => ({ name: service.name, service }),
  'registry'
)

export const deleteService = withEvents(
  function deleteService(name: string) {
    const service = getService(name)
    if (service) {
      delete sharedRegistry.services[name]
      return service
    }
    return null
  },
  'service:removed',
  (name) => ({ name, service: getService(name) }),
  'registry'
)

export const addService = withEvents(
  function addService(service: Microservice) {
    if (!getService(service.name)) {
      replaceService(service)
      return true
    }
    return false
  },
  'service:added',
  (service) => ({ name: service.name, service }),
  'registry'
)

// Registry management functions
export function getAllDependencies() {
  return { ...sharedRegistry.dependencies }
}

export function getAllComponents() {
  return { ...sharedRegistry.components }
}

export function getAllServices() {
  return { ...sharedRegistry.services }
}

export function getRegistry() {
  return { ...sharedRegistry }
}

export const clearRegistry = withEvents(
  function clearRegistry() {
    const oldRegistry = { ...sharedRegistry }
    sharedRegistry.dependencies = {}
    sharedRegistry.components = {}
    sharedRegistry.services = {}
    return oldRegistry
  },
  'registry:cleared',
  () => ({ timestamp: Date.now() }),
  'registry'
)

export function hasDependency(name: string) {
  return name in sharedRegistry.dependencies
}

export function hasComponent(name: string) {
  return name in sharedRegistry.components
}

export function hasService(name: string) {
  return name in sharedRegistry.services
}
