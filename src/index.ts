import type { RegistryProps, RegistryExporter, RegisterStylesheetProps } from './index.types';

export class Component extends HTMLElement {
  private unmount: (() => void) | undefined;
  private root: ShadowRoot;
  private container: HTMLElement;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.container = document.createElement('div');
    this.root.appendChild(this.container);
  }

  async loadStyles(styleUrl: string) {
    const response = await fetch(styleUrl);
    const css = await response.text();

    const styleSheet = new CSSStyleSheet();
    await styleSheet.replace(css);
    this.root.adoptedStyleSheets = [styleSheet];
  }

  async connectedCallback() {
    const src = this.getAttribute('src');
    const name = this.getAttribute('name');
    const stylesUrl = this.getAttribute('styles');
    if (stylesUrl) {
      await this.loadStyles(stylesUrl);
    }
    if (src && name) {
      importModule(name, src, result => {
        if (result && result.mount && typeof result.mount === 'function') {
          this.unmount = result.mount(this.container);
        }
      });
    }
  }
  disconnectedCallback() {
    if (this.unmount && typeof this.unmount === 'function') {
      this.unmount();
    }
  }
}

if (!customElements.get('app-component')) {
  customElements.define('app-component', Component);
}

export function createStore<T extends Record<string, any>>(initial: T) {
  let state = { ...initial };
  const subs = new Set<(s: T) => void>();
  const notify = () => subs.forEach(fn => fn({ ...state }));

  const api = {
    subscribe: (fn: (state: T) => void) => {
      subs.add(fn);
      fn({ ...state });
      return () => subs.delete(fn);
    },
  };

  return new Proxy(api as T & typeof api, {
    get(_, prop: string | symbol) {
      if (prop in api) return (api as any)[prop];
      return state[prop as keyof T];
    },
    set(_, prop: string | symbol, value: any) {
      if (prop in api) return true;
      state[prop as keyof T] = value;
      notify();
      return true;
    },
  });
}

const __$sharedLibs = new Map<string, any>();
const __$loadedScripts = new Map<string, string>();
const __$registry = new Map<string, RegistryProps>();

export function registerSharedLib(name: string, lib: unknown, global = false) {
  if (__$sharedLibs.has(name)) return;
  __$sharedLibs.set(name, lib);
  if (global) window[name] = lib;
}

export function useSharedLib<T = unknown>(name: string): T | undefined {
  return __$sharedLibs.get(name) as T | undefined;
}

function index(src: string, name: string) {
  return new Promise((resolve, reject) => {
    if (__$loadedScripts.has(name)) {
      resolve(true);
      return;
    }
    const existingScriptElement = document.querySelector(`script[src="${src}"]`);
    if (existingScriptElement) {
      existingScriptElement.addEventListener('load', () => {
        __$loadedScripts.set(name, src);
        resolve(true);
      });
      existingScriptElement.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = name;
    script.type = 'module';
    script.async = true;

    script.onload = () => {
      __$loadedScripts.set(name, src);
      resolve(true);
    };

    script.onerror = error => {
      reject(new Error(`Failed to load script: ${src}: ${error}`));
    };
    script.src = src;
    document.head.appendChild(script);
  });
}

export function importModule(
  name: string,
  src: string,
  resolve: (data: RegistryProps | undefined) => void
): void {
  const cb = () => {
    resolve && typeof resolve === 'function' && resolve(__$registry.get(name));
  };
  index(src, name).finally(cb);
}

export function importModuleAsync(name: string, src: string): Promise<RegistryProps | undefined> {
  return new Promise(resolve => {
    importModule(name, src, resolve);
  });
}

export function exportModule(name: string, props: RegistryProps): void {
  if (__$registry.has(name)) return;
  __$registry.set(name, props);
}

export function registerStylesheet({name, rel, obj}: RegisterStylesheetProps): void {
  const id = `rel-${name}-${obj}`
  const target = document.getElementById(id)
  if (target && !rel) return
  const el = document.createElement('link')
  el.id = id
  el.href = rel
  el.rel = 'stylesheet'
  el.crossOrigin = 'crossorigin'
  document.head.appendChild(el)
}

const exporter: RegistryExporter = {
  importModule,
  importModuleAsync,
  exportModule,
  registerSharedLib,
  useSharedLib,
  createStore,
  registerStylesheet,
};

if (!window['Microstix']) {
  window['Microstix'] = exporter;
}

export default window['Microstix'].default ?? window['Microstix'] ?? exporter;
