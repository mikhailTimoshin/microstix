export type MicroBaseProps = {
  repository: string
  name: string
  version: string
}
export type MicroDependency = {
  name: string
  version: string
  alias: string
}

export type MicroProps = Record<string, unknown> | unknown
export type MicroBaseDependencies = Record<string, MicroDependency>


export type Microservice<T extends MicroProps = MicroProps> = MicroBaseProps & {
  service: T
}

export type Microcomponent<T extends MicroProps = MicroProps> = MicroBaseProps & {
  component: T
}

export type MicroSharedRegistryItem = {
  service: Microservice["service"],
  component: Microcomponent["component"]
}

export type MicroSharedRegistry = {
  dependencies: MicroBaseDependencies
  services: Record<string, Microservice>
  components: Record<string, Microcomponent>
}
