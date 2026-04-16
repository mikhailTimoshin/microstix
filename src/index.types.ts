export type RegistryBaseProps = {
  name: string;
  version: string;
  mount?: (target: HTMLElement, context?: Record<string, unknown>) => (() => void) | undefined;
};
export type RegistryProps = RegistryBaseProps & Record<string, unknown>;

export type RegisterStylesheetProps = {
  name: string;
  rel: string;
  obj: string
}

export type RegistryExporter = {
  default?: RegistryExporter;
  importModule: (
    name: string,
    src: string,
    resolve: (data: RegistryProps | undefined) => void
  ) => void;
  importModuleAsync: (name: string, src: string) => Promise<RegistryProps | undefined>
  exportModule: (name: string, props: RegistryProps) => void;
  registerSharedLib: (name: string, lib: unknown, global?: boolean) => void;
  useSharedLib: <T = unknown>(name: string) => T | undefined;
  registerImport: (name: string, data: unknown) => void
  registerStylesheet: (cfg: RegisterStylesheetProps) => void
  createStore: <T extends Record<string, any>>(initial: T) => T & {subscribe: (fn: (state: T) => void) => () => boolean};
};

declare global {
  interface Window {
    Microstix?: RegistryExporter;
    [name: string]: unknown;
  }
}
