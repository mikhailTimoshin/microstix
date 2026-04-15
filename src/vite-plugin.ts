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
    formats = ['umd'],
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
 * Вспомогательная функция для создания конфигурации микрофронтенда
 */
export function defineMicrostixConfig(config: MicrostixViteConfig): MicrostixViteConfig {
  return config;
}

/**
 * Создает стандартную конфигурацию для React микрофронтенда
 */
export function createReactConfig(
  projectName: string,
  options: Partial<MicrostixViteConfig> = {}
): MicrostixViteConfig {
  return {
    projectName,
    entry: 'src/index.jsx',
    styles: 'src/App.css',
    libraryName: projectName,
    formats: ['umd'],
    externals: ['react', 'react-dom', 'microstix'],
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      microstix: 'Microstix',
    },
    devPort: 3001,
    basePath: `/static/${projectName}/`,
    sourcemap: true,
    minify: true,
    ...options,
  };
}

/**
 * Создает стандартную конфигурацию для Vue микрофронтенда
 */
export function createVueConfig(
  projectName: string,
  options: Partial<MicrostixViteConfig> = {}
): MicrostixViteConfig {
  return {
    projectName,
    entry: 'src/main.js',
    styles: 'src/style.css',
    libraryName: projectName,
    formats: ['umd'],
    externals: ['vue', 'microstix'],
    globals: {
      vue: 'Vue',
      microstix: 'Microstix',
    },
    devPort: 3002,
    basePath: `/static/${projectName}/`,
    sourcemap: true,
    minify: true,
    ...options,
  };
}

/**
 * Создает стандартную конфигурацию для Svelte микрофронтенда
 */
export function createSvelteConfig(
  projectName: string,
  options: Partial<MicrostixViteConfig> = {}
): MicrostixViteConfig {
  return {
    projectName,
    entry: 'src/main.js',
    styles: 'src/app.css',
    libraryName: projectName,
    formats: ['umd'],
    externals: ['svelte', 'microstix'],
    globals: {
      svelte: 'Svelte',
      microstix: 'Microstix',
    },
    devPort: 3003,
    basePath: `/static/${projectName}/`,
    sourcemap: true,
    minify: true,
    ...options,
  };
}

/**
 * Создает стандартную конфигурацию для Vanilla JS микрофронтенда
 */
export function createVanillaConfig(
  projectName: string,
  options: Partial<MicrostixViteConfig> = {}
): MicrostixViteConfig {
  return {
    projectName,
    entry: 'src/index.js',
    styles: 'src/styles.css',
    libraryName: projectName,
    formats: ['umd'],
    externals: ['microstix'],
    globals: {
      microstix: 'Microstix',
    },
    devPort: 3004,
    basePath: `/static/${projectName}/`,
    sourcemap: true,
    minify: true,
    ...options,
  };
}

/**
 * Валидирует конфигурацию микрофронтенда
 */
export function validateConfig(config: MicrostixViteConfig): string[] {
  const errors: string[] = [];

  if (!config.projectName || typeof config.projectName !== 'string') {
    errors.push('projectName обязателен и должен быть строкой');
  }

  if (config.entry && typeof config.entry !== 'string') {
    errors.push('entry должен быть строкой');
  }

  if (config.styles && typeof config.styles !== 'string') {
    errors.push('styles должен быть строкой');
  }

  if (config.libraryName && typeof config.libraryName !== 'string') {
    errors.push('libraryName должен быть строкой');
  }

  if (config.formats && !Array.isArray(config.formats)) {
    errors.push('formats должен быть массивом');
  }

  if (config.externals && !Array.isArray(config.externals)) {
    errors.push('externals должен быть массивом');
  }

  if (config.globals && typeof config.globals !== 'object') {
    errors.push('globals должен быть объектом');
  }

  if (
    config.devPort &&
    (typeof config.devPort !== 'number' || config.devPort < 1 || config.devPort > 65535)
  ) {
    errors.push('devPort должен быть числом от 1 до 65535');
  }

  if (config.basePath && typeof config.basePath !== 'string') {
    errors.push('basePath должен быть строкой');
  }

  return errors;
}

/**
 * Создает полный конфиг Vite на основе конфигурации Microstix
 */
export function generateViteConfig(config: MicrostixViteConfig): Record<string, any> {
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error(`Ошибки в конфигурации:\n${errors.join('\n')}`);
  }

  const entryPoints: Record<string, string> = {};

  if (config.entry) {
    entryPoints.main = config.entry;
  }

  if (config.styles) {
    entryPoints.styles = config.styles;
  }

  return {
    base: config.basePath || `/static/${config.projectName}/`,
    build: {
      lib: {
        entry: entryPoints,
        name: config.libraryName || config.projectName,
        formats: config.formats || ['umd'],
      },
      cssCodeSplit: true,
      outDir: `dist/${config.projectName}`,
      rollupOptions: {
        external: config.externals || [],
        output: {
          assetFileNames: 'assets/[name][extname]',
          globals: config.globals || {},
          sourcemap: config.sourcemap !== false,
        },
      },
      minify: config.minify !== false ? 'terser' : false,
      emptyOutDir: true,
    },
    server: {
      port: config.devPort || 3001,
      cors: true,
    },
    ...config.viteOptions,
  };
}

/**
 * Основной экспорт плагина Vite для Microstix
 */
export const vitePlugin = {
  microstixVitePlugin,
  createMicrostixConfig,
  defineMicrostixConfig,
  createReactConfig,
  createVueConfig,
  createSvelteConfig,
  createVanillaConfig,
  validateConfig,
  generateViteConfig,
};

export default microstixVitePlugin;
