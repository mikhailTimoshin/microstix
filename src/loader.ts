import type { LoadScriptProps, LoadMicrofrontendInfo } from './loader.types'

const loadedScripts = new Map<string, Element>();

function loadScript({ src, name, isDev = true }:LoadScriptProps) {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has(src)) {
      const existingScript = loadedScripts.get(src);
      resolve(existingScript);
      return;
    }

    const existingScriptElement = document.querySelector(
      `script[src="${src}"]`,
    );
    if (existingScriptElement) {
      existingScriptElement.addEventListener("load", () => {
        loadedScripts.set(src, existingScriptElement);
        resolve(existingScriptElement);
      });
      existingScriptElement.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = name
    script.type = !isDev ? "text/javascript" : "module";
    script.async = true;

    script.onload = () => {
      loadedScripts.set(src, script);
      resolve(script);
    };

    script.onerror = (error) => {
      reject(new Error(`Failed to load script: ${src}: ${error}`));
    };
    script.src = src;
    document.head.appendChild(script);
  });
}

export function importMicrofrontend(info: LoadMicrofrontendInfo) {
  const isDev = info.isProd === undefined ? true : info.isProd
  const callback = () => {
      info.onComplete && typeof info.onComplete === "function" && info.onComplete()
  }
  loadScript({ src: info.url, name: info.name, isDev: !isDev }).then(() => {
  }).catch(() => {
  }).finally(callback)
}
