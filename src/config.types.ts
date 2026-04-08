/**
 * Types for microfrontend configuration
 */

/**
 * Shared dependency configuration
 */
export interface SharedDependency {
  name: string
  version: string
  global: string
  import: string
}

/**
 * Build configuration
 */
export interface BuildConfig {
  formats: Array<'umd' | 'es' | 'iife' | 'cjs'>
  minify: boolean
  sourcemap: boolean
  target: string
  outDir: string
  fileName: string
}

/**
 * Export definition for components and services
 */
export interface ExportDefinition {
  name: string
  type: 'component' | 'service' | 'utility'
  description?: string
  props?: Record<string, any>
}

/**
 * Microfrontend metadata
 */
export interface MicrofrontMetadata {
  type: 'microfrontend' | 'library' | 'widget'
  framework: 'react' | 'vue' | 'svelte' | 'angular' | 'vanilla'
  environment: 'browser' | 'node' | 'universal'
  category?: string
  tags?: string[]
  author?: string
  repository?: string
}

/**
 * Complete microfrontend configuration
 */
export interface MicrofrontendConfig {
  // Basic information
  name: string
  version: string
  entry: string

  // Dependencies
  sharedDeps: Record<string, SharedDependency>

  // Build configuration
  build: BuildConfig

  // Exports
  exports: {
    components: ExportDefinition[]
    services: ExportDefinition[]
    utilities?: ExportDefinition[]
  }

  // Metadata
  metadata: MicrofrontMetadata

  // Runtime configuration (optional)
  runtime?: {
    css?: string[]
    scripts?: string[]
    preload?: string[]
    sandbox?: boolean
    permissions?: string[]
  }
}

/**
 * Generated configuration files
 */
export interface GeneratedConfigs {
  vite: any
  webpack: any
  packageJson: any
  tsconfig: any
  manifest: any
}

/**
 * CLI options for configuration generation
 */
export interface CliOptions {
  name: string
  entry?: string
  framework?: 'react' | 'vue' | 'svelte' | 'vanilla'
  typescript?: boolean
  outputDir?: string
  sharedDeps?: Record<string, SharedDependency>
  minify?: boolean
  sourcemap?: boolean
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  name: string
  description: string
  framework: string
  dependencies: Record<string, string>
  files: Record<string, string>
  commands: Record<string, string>
}
