export type RegistryBaseProps = { name: string, version: string }
export type RegistryProps = RegistryBaseProps & Record<string, unknown>

export type RegistryExporter = {
  importModule: (name: string, src: string, resolve: (data: (RegistryProps | undefined)) => void) => void
  exportModule: (name: string, props: RegistryProps) => void
}

declare global {
  interface Window {
    Microstix?: RegistryExporter
  }
}


