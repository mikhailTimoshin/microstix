export type RegistryBaseProps = {
  name: string;
  version: string;
  mount?: (target: HTMLElement, context?: Record<string, unknown>) => void;
};
export type RegistryProps = RegistryBaseProps & Record<string, unknown>;

export type RegistryExporter = {
  importModule: (
    name: string,
    src: string,
    resolve: (data: RegistryProps | undefined) => void
  ) => void;
  exportModule: (name: string, props: RegistryProps) => void;
  registerSharedLib: (name: string, lib: unknown, global?: boolean) => void;
  useSharedLib: (name: string) => unknown;
};

declare global {
  interface Window {
    Microstix?: RegistryExporter;
    [name: string]: unknown;
  }
}
