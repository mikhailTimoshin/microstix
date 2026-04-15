import type { Plugin } from 'vite';
import type { UserConfig } from 'vite';

export interface MicrostixViteConfig {
  /**
   * Имя проекта/микрофронтенда
   */
  name: string;

  /**
   * Путь к точке входа (по умолчанию: 'src/index.jsx')
   */
  component?: string;

  /**
   * Форматы сборки (по умолчанию: ['umd'])
   */
  formats?: ('umd' | 'es' | 'cjs')[];

  /**
   * Глобальные переменные для внешних зависимостей
   */
  sharedLibs?: Record<string, string>;

  /**
   * Порт для dev сервера (по умолчанию: 3001)
   */
  port?: number;

  /**
   * Базовый путь для статических ресурсов
   */
  basePath?: string;

  /**
   * Включить sourcemaps (по умолчанию: true)
   */
  sourcemap?: boolean;

  /**
   * Минимизировать код в production (по умолчанию: true)
   */
  minify?: boolean;

  /**
   * Дополнительные настройки Vite
   */
  viteOptions?: Record<string, any>;
}

function createSharedLibs(libs: Record<string, string>) {
  let result: string[] = [];
  if (libs) {
    Object.keys(libs).forEach((key) => {
      result.push(key)
    })
  }
  return result;
}

/**
 * Создает конфигурацию Vite для микрофронтенда
 */
function createMicrostixConfig(config: MicrostixViteConfig): Partial<UserConfig> {
  const {
    name,
    component = 'src/index.jsx',
    formats = ['es', 'cjs'],
    sharedLibs = {
      'react': "React",
      "react-dom": "ReactDOM",
      'microstix': "Microstix",
    },
    port = 3001,
    basePath = `/${name}/`,
    sourcemap = true,
    minify = true,
    viteOptions = {},
  } = config;

  const external = createSharedLibs(config.sharedLibs || {})

  const entryPoints: Record<string, string> = {
    index: component,
  };

  return {
    base: basePath,
    build: {
      lib: {
        entry: entryPoints,
        name,
        formats,
      },
      cssCodeSplit: true,
      outDir: `dist/${name}`,
      rollupOptions: {
        external,
        output: {
          globals: sharedLibs,
          sourcemap,
        },
      },
      minify: minify ? 'terser' : false,
      emptyOutDir: true,
    },
    server: {
      port,
      cors: true,
    },
    ...viteOptions,
  };
}

/**
 * Плагин Vite для Microstix
 */
export function microstixVitePlugin(config: MicrostixViteConfig): Plugin {
  const plugin: Plugin = {
    name: 'microstix-vite-plugin',
    config: () => createMicrostixConfig(config),
  };

  return plugin;
}


/**
 * Основной экспорт плагина Vite для Microstix
 */
export const vitePlugin = {
  microstixVitePlugin,
};

export default microstixVitePlugin;
