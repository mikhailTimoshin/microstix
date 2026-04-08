import type { RegistryProps, RegistryExporter } from './index.types';

const __$loadedScripts = new Map<string, string>();
const __$registry = new Map<string, RegistryProps>();

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

function importModule(
  name: string,
  src: string,
  resolve: (data: RegistryProps | undefined) => void
): void {
  const cb = () => {
    resolve && typeof resolve === 'function' && resolve(__$registry.get(name));
  };
  index(src, name).finally(cb);
}

function exportModule(name: string, props: RegistryProps): void {
  if (__$registry.has(name)) return;
  __$registry.set(name, { ...props, url: __$loadedScripts.get(name)});
}

const exporter: RegistryExporter = {
  importModule,
  exportModule,
};


if (!window['Microstix']) {
  console.log(window['Microstix']);
  window['Microstix'] = exporter;
}

export default window['Microstix'] ?? exporter;
