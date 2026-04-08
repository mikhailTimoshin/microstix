/**
 * Configuration generator for microfrontends
 * Provides minimal configuration for UMD/USM modules
 */

import type { MicrofrontendConfig, BuildConfig, SharedDependency } from './config.types'

/**
 * Default shared dependencies for microfrontends
 */
export const DEFAULT_SHARED_DEPS: Record<string, SharedDependency> = {
  react: {
    name: 'react',
    version: '^18.2.0',
    global: 'React',
    import: 'react'
  },
  'react-dom': {
    name: 'react-dom',
    version: '^18.2.0',
    global: 'ReactDOM',
    import: 'react-dom'
  },
  'react-router-dom': {
    name: 'react-router-dom',
    version: '^6.20.0',
    global: 'ReactRouterDOM',
    import: 'react-router-dom'
  }
}

/**
 * Default build configuration
 */
export const DEFAULT_BUILD_CONFIG: BuildConfig = {
  formats: ['umd', 'es'] as const,
  minify: true,
  sourcemap: true,
  target: 'es2020',
  outDir: 'dist',
  fileName: '[name].[format].js'
}

/**
 * Generate minimal configuration for a microfrontend
 */
export function createMicrofrontConfig(
  name: string,
  entry: string = 'src/index.ts',
  customConfig: Partial<MicrofrontendConfig> = {}
): MicrofrontendConfig {
  const baseConfig: MicrofrontendConfig = {
    name,
    entry,
    version: '1.0.0',
    sharedDeps: DEFAULT_SHARED_DEPS,
    build: DEFAULT_BUILD_CONFIG,
    exports: {
      components: [],
      services: []
    },
    metadata: {
      type: 'microfrontend',
      framework: 'react',
      environment: 'browser'
    }
  }

  return deepMerge(baseConfig, customConfig)
}

/**
 * Generate Vite configuration for microfrontend
 */
export function generateViteConfig(config: MicrofrontendConfig) {
  const external = Object.keys(config.sharedDeps)
  const globals = Object.entries(config.sharedDeps).reduce((acc, [key, dep]) => {
    acc[key] = dep.global
    return acc
  }, {} as Record<string, string>)

  return {
    build: {
      lib: {
        entry: config.entry,
        name: config.name,
        formats: config.build.formats,
        fileName: (format: string) =>
          config.build.fileName.replace('[name]', config.name).replace('[format]', format)
      },
      minify: config.build.minify,
      sourcemap: config.build.sourcemap,
      target: config.build.target,
      outDir: config.build.outDir,
      rollupOptions: {
        external,
        output: {
          globals,
          exports: 'named',
          interop: 'auto'
        }
      }
    },
    define: {
      __MICROFRONT_NAME__: JSON.stringify(config.name),
      __MICROFRONT_VERSION__: JSON.stringify(config.version),
      __MICROFRONT_EXPORTS__: JSON.stringify(config.exports)
    }
  }
}

/**
 * Generate Webpack configuration for microfrontend
 */
export function generateWebpackConfig(config: MicrofrontendConfig) {
  const externals = Object.entries(config.sharedDeps).reduce((acc, [key, dep]) => {
    acc[key] = {
      root: dep.global,
      commonjs: key,
      commonjs2: key,
      amd: key
    }
    return acc
  }, {} as Record<string, any>)

  return {
    output: {
      library: {
        name: config.name,
        type: 'umd'
      },
      filename: config.build.fileName.replace('[name]', config.name).replace('[format]', '[contenthash]'),
      path: config.build.outDir,
      globalObject: 'this'
    },
    externals,
    optimization: {
      minimize: config.build.minify
    },
    plugins: [
      {
        apply(compiler: any) {
          compiler.hooks.compilation.tap('MicrofrontConfig', (compilation: any) => {
            compilation.hooks.processAssets.tap(
              {
                name: 'MicrofrontConfig',
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
              },
              () => {
                const manifest = {
                  name: config.name,
                  version: config.version,
                  entry: config.entry,
                  sharedDeps: config.sharedDeps,
                  exports: config.exports,
                  metadata: config.metadata,
                  buildTime: new Date().toISOString()
                }

                const source = new compiler.webpack.sources.RawSource(JSON.stringify(manifest, null, 2))
                compilation.emitAsset('manifest.json', source)
              }
            )
          })
        }
      }
    ]
  }
}

/**
 * Generate package.json for microfrontend
 */
export function generatePackageJson(config: MicrofrontendConfig) {
  const dependencies = Object.entries(config.sharedDeps).reduce((acc, [key, dep]) => {
    acc[key] = dep.version
    return acc
  }, {} as Record<string, string>)

  return {
    name: config.name,
    version: config.version,
    type: 'module',
    main: `./${config.build.outDir}/${config.name}.umd.js`,
    module: `./${config.build.outDir}/${config.name}.es.js`,
    exports: {
      '.': {
        import: `./${config.build.outDir}/${config.name}.es.js`,
        require: `./${config.build.outDir}/${config.name}.umd.js`
      },
      './package.json': './package.json'
    },
    dependencies,
    peerDependencies: dependencies,
    files: [
      config.build.outDir,
      'README.md'
    ],
    microfront: {
      name: config.name,
      version: config.version,
      exports: config.exports,
      metadata: config.metadata
    }
  }
}

/**
 * Generate TypeScript configuration for microfrontend
 */
export function generateTsConfig(config: MicrofrontendConfig) {
  return {
    compilerOptions: {
      target: config.build.target,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'node',
      declaration: true,
      declarationMap: true,
      sourceMap: config.build.sourcemap,
      outDir: config.build.outDir,
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      jsx: 'react-jsx',
      allowSyntheticDefaultImports: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist']
  }
}

/**
 * Generate manifest for microfrontend registry
 */
export function generateManifest(config: MicrofrontendConfig) {
  return {
    id: `${config.name}@${config.version}`,
    name: config.name,
    version: config.version,
    entry: `${config.name}.umd.js`,
    formats: config.build.formats,
    sharedDeps: config.sharedDeps,
    exports: config.exports,
    metadata: config.metadata,
    build: {
      timestamp: new Date().toISOString(),
      target: config.build.target,
      minified: config.build.minify
    }
  }
}

/**
 * Create a CLI config file for easy setup
 */
export function createCliConfig(config: MicrofrontendConfig) {
  const configObject = {
    name: config.name,
    entry: config.entry,
    version: config.version,
    sharedDeps: config.sharedDeps,
    build: config.build,
    exports: config.exports,
    metadata: config.metadata
  };

  return `// microstix.config.js
// Конфигурация микрофронтенда для Microstix
// Этот файл используется для генерации конфигураций сборки

export default ${JSON.stringify(configObject, null, 2)};

// Альтернативный вариант с функциями (раскомментировать если нужно):
/*
import { createMicrofrontConfig } from 'microstix-library/config';

export default createMicrofrontConfig('${config.name}', '${config.entry}', ${JSON.stringify({
    version: config.version,
    sharedDeps: config.sharedDeps,
    build: config.build,
    exports: config.exports,
    metadata: config.metadata
  }, null, 2)});
*/
`
}

/**
 * Deep merge utility function
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {} as any, source[key] as any)
    } else {
      result[key] = source[key] as any
    }
  }

  return result
}

/**
 * Validate microfrontend configuration
 */
export function validateConfig(config: MicrofrontendConfig): string[] {
  const errors: string[] = []

  if (!config.name || typeof config.name !== 'string') {
    errors.push('Configuration must have a valid name')
  }

  if (!config.entry || typeof config.entry !== 'string') {
    errors.push('Configuration must have a valid entry point')
  }

  if (!config.version || !/^\d+\.\d+\.\d+$/.test(config.version)) {
    errors.push('Configuration must have a valid semantic version (x.y.z)')
  }

  if (!config.sharedDeps || typeof config.sharedDeps !== 'object') {
    errors.push('Configuration must have sharedDeps object')
  }

  if (!config.build || typeof config.build !== 'object') {
    errors.push('Configuration must have build configuration')
  }

  return errors
}

/**
 * Create configuration for different types of microfrontends
 */
export const MicrofrontTemplates = {
  react: (name: string, entry: string = 'src/index.tsx') =>
    createMicrofrontConfig(name, entry, {
      metadata: {
        type: 'microfrontend',
        framework: 'react',
        environment: 'browser'
      },
      sharedDeps: DEFAULT_SHARED_DEPS
    }),

  vue: (name: string, entry: string = 'src/index.ts') =>
    createMicrofrontConfig(name, entry, {
      metadata: {
        type: 'microfrontend',
        framework: 'vue',
        environment: 'browser'
      },
      sharedDeps: {
        vue: {
          name: 'vue',
          version: '^3.3.0',
          global: 'Vue',
          import: 'vue'
        },
        'vue-router': {
          name: 'vue-router',
          version: '^4.2.0',
          global: 'VueRouter',
          import: 'vue-router'
        }
      }
    }),

  svelte: (name: string, entry: string = 'src/index.ts') =>
    createMicrofrontConfig(name, entry, {
      metadata: {
        type: 'microfrontend',
        framework: 'svelte',
        environment: 'browser'
      },
      sharedDeps: {
        svelte: {
          name: 'svelte',
          version: '^4.0.0',
          global: 'Svelte',
          import: 'svelte'
        }
      }
    }),

  vanilla: (name: string, entry: string = 'src/index.ts') =>
    createMicrofrontConfig(name, entry, {
      metadata: {
        type: 'microfrontend',
        framework: 'vanilla',
        environment: 'browser'
      },
      sharedDeps: {}
    })
}
