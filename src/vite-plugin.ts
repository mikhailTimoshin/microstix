import type { Plugin } from 'vite';
import type { UserConfig } from 'vite';

export interface MicrostixViteConfig {
  isHost?: boolean;
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

  optimize?: string[];
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
    isHost = false,
    name,
    component = 'src/index.jsx',
    formats = ['es', 'cjs'],
    sharedLibs = {
      'react': "React",
      "react-dom": "ReactDOM"
    },
    port = 3001,
    basePath = isHost ? '/' : `/${name}/`,
    sourcemap = true,
    minify = true,
    viteOptions = {},
    optimize = [],
  } = config;

  const external = createSharedLibs(config.sharedLibs || {})

  const entryPoints: Record<string, string> = {
    index: component,
  };

  return {
    base: basePath,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
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
    optimizeDeps: {
      include: optimize,
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

export function getReactProd(isProd: boolean) {
  if (!isProd) {return {}}
  return { jsxImportSource: 'microstix' }
}

/**
 * Основной экспорт плагина Vite для Microstix
 */
export const vitePlugin = {
  microstixVitePlugin,
  getReactProd,
};

export default microstixVitePlugin;
