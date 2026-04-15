import type { Plugin } from 'vite';
import type { UserConfig } from 'vite';

export interface MicrostixViteConfig {
  /**
   * Имя проекта/микрофронтенда
   */
  projectName: string;

  /**
   * Путь к точке входа (по умолчанию: 'src/index.jsx')
   */
  entry?: string;

  /**
   * Путь к CSS файлу (по умолчанию: 'src/App.css')
   */
  styles?: string;

  /**
   * Имя библиотеки для UMD бандла
   */
  libraryName?: string;

  /**
   * Форматы сборки (по умолчанию: ['umd'])
   */
  formats?: ('umd' | 'es' | 'cjs')[];

  /**
   * Внешние зависимости для исключения из бандла
   */
  externals?: string[];

  /**
   * Глобальные переменные для внешних зависимостей
   */
  globals?: Record<string, string>;

  /**
   * Порт для dev сервера (по умолчанию: 3001)
   */
  devPort?: number;

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

/**
 * Создает конфигурацию Vite для микрофронтенда
 */
export function createMicrostixConfig(config: MicrostixViteConfig): Partial<UserConfig> {
  const {
    projectName,
    entry = 'src/App.jsx',
    styles = 'src/App.css',
    libraryName = projectName,
    formats = ['es', 'cjs'],
    externals = ['react', 'react-dom', 'microstix'],
    globals = {
      react: 'React',
      'react-dom': 'ReactDOM',
      microstix: 'Microstix',
    },
    devPort = 3001,
    basePath = `/static/${projectName}/`,
    sourcemap = true,
    minify = true,
    viteOptions = {},
  } = config;

  const entryPoints: Record<string, string> = {
    main: entry,
  };

  if (styles) {
    entryPoints.styles = styles;
  }

  return {
    base: basePath,
    build: {
      lib: {
        entry: entryPoints,
        name: libraryName,
        formats,
      },
      cssCodeSplit: true,
      outDir: `dist/${projectName}`,
      rollupOptions: {
        external: externals,
        output: {
          assetFileNames: 'assets/[name][extname]',
          globals,
          sourcemap,
        },
      },
      minify: minify ? 'terser' : false,
      emptyOutDir: true,
    },
    server: {
      port: devPort,
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
  createMicrostixConfig,
};

export default microstixVitePlugin;
