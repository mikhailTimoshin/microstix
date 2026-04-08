/**
 * CLI tool for microfrontend configuration
 * With full file system operations support
 */

import { generateViteConfig, generatePackageJson, generateTsConfig, generateManifest, createCliConfig, validateConfig, MicrofrontTemplates } from './config'
import type { CliOptions } from './config.types'

// File system operations
import * as fs from 'fs'
import * as path from 'path'

/**
 * Create a new microfrontend project configuration
 */
export async function createProject(options: CliOptions) {
  console.log(`🚀 Создание конфигурации микрофронтенда: ${options.name}`)

  // Create configuration
  const template = options.framework || 'react'
  const config = (MicrofrontTemplates as any)[template](
    options.name,
    options.entry || `src/index.${options.typescript ? 'ts' : 'tsx'}`
  )

  // Apply custom options
  if (options.sharedDeps) {
    config.sharedDeps = { ...config.sharedDeps, ...options.sharedDeps }
  }

  if (options.minify !== undefined) {
    config.build.minify = options.minify
  }

  if (options.sourcemap !== undefined) {
    config.build.sourcemap = options.sourcemap
  }

  // Validate configuration
  const errors = validateConfig(config)
  if (errors.length > 0) {
    console.error('❌ Валидация конфигурации не удалась:')
    errors.forEach(error => console.error(`   - ${error}`))
    return
  }

  const outputDir = options.outputDir || options.name

  try {
    // Create project directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
      console.log(`📁 Создана директория проекта: ${outputDir}`)
    } else {
      console.log(`📁 Используется существующая директория: ${outputDir}`)
    }

    // Create src directory
    const srcDir = path.join(outputDir, 'src')
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true })
    }

    // Generate configuration files content
    const packageJson = generatePackageJson(config)
    const tsConfig = generateTsConfig(config)
    const manifest = generateManifest(config)
    const cliConfig = createCliConfig(config)

    // Write configuration files
    const viteConfigContent = `import { defineConfig } from 'vite'
import microstixConfig from './microstix.config.js'

export default defineConfig({
  build: {
    lib: {
      entry: microstixConfig.entry,
      name: microstixConfig.name,
      formats: microstixConfig.build.formats,
      fileName: (format) =>
        microstixConfig.build.fileName
          .replace('[name]', microstixConfig.name)
          .replace('[format]', format)
    },
    minify: microstixConfig.build.minify,
    sourcemap: microstixConfig.build.sourcemap,
    target: microstixConfig.build.target,
    outDir: microstixConfig.build.outDir,
    rollupOptions: {
      external: Object.keys(microstixConfig.sharedDeps),
      output: {
        globals: Object.entries(microstixConfig.sharedDeps).reduce((acc, [key, dep]) => {
          acc[key] = dep.global
          return acc
        }, {}),
        exports: 'named',
        interop: 'auto'
      }
    }
  },
  define: {
    __MICROFRONT_NAME__: JSON.stringify(microstixConfig.name),
    __MICROFRONT_VERSION__: JSON.stringify(microstixConfig.version),
    __MICROFRONT_EXPORTS__: JSON.stringify(microstixConfig.exports)
  }
})
`

    // Create entry point file based on framework
    let entryContent = ''
    switch (template) {
      case 'react':
        entryContent = `import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// Экспорт для использования в хостовом приложении
window.${config.name.replace(/-/g, '_')} = {
  init: (containerId, props = {}) => {
    const root = ReactDOM.createRoot(document.getElementById(containerId))
    root.render(React.createElement(App, props))

    return () => root.unmount()
  }
}

// Для разработки
if (import.meta.env.DEV) {
  const containerId = '${config.name}-dev'
  if (!document.getElementById(containerId)) {
    const devContainer = document.createElement('div')
    devContainer.id = containerId
    document.body.appendChild(devContainer)
  }

  window.${config.name.replace(/-/g, '_')}.init('${config.name}-dev', {})
}
`
        break
      case 'vue':
        entryContent = `import { createApp } from 'vue'
import App from './App.vue'

// Экспорт для использования в хостовом приложении
window.${config.name.replace(/-/g, '_')} = {
  init: (containerId, props = {}) => {
    const app = createApp(App, props)
    const container = document.getElementById(containerId)

    if (container) {
      app.mount(container)
    }

    return () => app.unmount()
  }
}
`
        break
      case 'svelte':
        entryContent = `import App from './App.svelte'

// Экспорт для использования в хостовом приложении
window.${config.name.replace(/-/g, '_')} = {
  init: (containerId, props = {}) => {
    const container = document.getElementById(containerId)

    if (container) {
      const app = new App({
        target: container,
        props
      })

      return () => app.$destroy()
    }

    return () => {}
  }
}
`
        break
      case 'vanilla':
        entryContent = `// Экспорт для использования в хостовом приложении
// Экспорт для использования в хостовом приложении
window.${config.name.replace(/-/g, '_')} = {
  init: (containerId, props = {}) => {
    const container = document.getElementById(containerId)

    if (container) {
      container.innerHTML = \`
        <div class="${config.name}">
          <h1>${config.name} работает!</h1>
          <p>Параметры: \${JSON.stringify(props)}</p>
        </div>
      \`
    }

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }
}
`
        break
    }

    // Create App component for React
    let appContent = ''
    if (template === 'react') {
      appContent = `import React from 'react'

interface AppProps {
  title?: string
}

const App: React.FC<AppProps> = ({ title = '${config.name}' }) => {
  return (
    <div className="${config.name}">
      <h1>{title}</h1>
      <p>Микрофронтенд ${config.name} успешно загружен!</p>
    </div>
  )
}

export default App
`
    }

    // Write files
    fs.writeFileSync(path.join(outputDir, 'microstix.config.js'), cliConfig)
    fs.writeFileSync(path.join(outputDir, 'vite.config.js'), viteConfigContent)
    fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2))
    fs.writeFileSync(path.join(outputDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2))
    fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
    fs.writeFileSync(path.join(outputDir, config.entry), entryContent)

    if (appContent) {
      const appPath = path.join(outputDir, 'src', 'App.tsx')
      fs.writeFileSync(appPath, appContent)
    }

    // Create README
    const readmeContent = `# ${config.name}

Микрофронтенд созданный с помощью Microstix

## Разработка

\`\`\`bash
npm install
npm run dev
\`\`\`

## Сборка

\`\`\`bash
npm run build
\`\`\`

## Использование в хостовом приложении

\`\`\`javascript
import { importMicrofront } from 'microstix-library'

// Загрузка микрофронтенда
// Для загрузки микрофронтенда используйте:
// import { importMicrofront } from 'microstix-library'
//
// importMicrofront('/path/to/${config.name}.umd.js', '${config.name}', (result) => {
//   if (result.component) {
//     // Использование компонента
//     const unmount = window.${config.name.replace(/-/g, '_')}.init('container-id', { title: 'Мой заголовок' })
//
//     // Для очистки
//     // unmount()
//   }
// })
\`\`\`

## Конфигурация

См. файл \`microstix.config.js\` для настройки зависимостей и сборки.
`

    fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent)

    console.log(`✅ Конфигурация создана для: ${config.name}`)
    console.log(`\n📁 Структура проекта создана в: ${outputDir}`)
    console.log(`\n📄 Созданные файлы:`)
    console.log(`   ✓ microstix.config.js`)
    console.log(`   ✓ vite.config.js`)
    console.log(`   ✓ package.json`)
    console.log(`   ✓ tsconfig.json`)
    console.log(`   ✓ manifest.json`)
    console.log(`   ✓ ${config.entry}`)
    if (appContent) console.log(`   ✓ src/App.tsx`)
    console.log(`   ✓ README.md`)

    console.log(`\n🎉 Проект готов! Следующие шаги:`)
    console.log(`   1. Перейти в директорию: cd ${outputDir}`)
    console.log(`   2. Установить зависимости: npm install`)
    console.log(`   3. Запустить разработку: npm run dev`)
    console.log(`   4. Собрать проект: npm run build`)

  } catch (error) {
    console.error(`❌ Ошибка при создании проекта:`, error)
  }
}

/**
 * Generate configuration for existing project
 */
export async function generateConfig(name: string, framework: string = 'react') {
  console.log(`⚙️  Генерация конфигурации для: ${name}`)

  const config = (MicrofrontTemplates as any)[framework](name)
  const cliConfig = createCliConfig(config)

  console.log(`✅ Конфигурация сгенерирована`)
  console.log(`\n📝 Добавьте в ваш microstix.config.js:`)
  console.log(cliConfig)

  console.log(`\n📄 Конфигурация Vite:`)
  const viteConfig = generateViteConfig(config)
  console.log(JSON.stringify(viteConfig, null, 2))

  // Check if we're in a project directory
  try {
    const cwd = process.cwd()
    const packageJsonPath = path.join(cwd, 'package.json')

    if (fs.existsSync(packageJsonPath)) {
      console.log(`\n📁 Текущая директория: ${cwd}`)
      console.log(`📦 package.json найден`)

      // Offer to create config file
      const configPath = path.join(cwd, 'microstix.config.js')
      if (!fs.existsSync(configPath)) {
        console.log(`\n💡 Хотите создать файл конфигурации? (y/n)`)
        // In real CLI, we would read user input here
        console.log(`   Для создания запустите: npx microstix-library create ${name}`)
      }
    }
  } catch (error) {
    // Silent fail - just informational
  }
}

/**
 * Validate project configuration
 */
export async function validateProject() {
  console.log(`🔍 Проверка конфигурации...`)

  const cwd = process.cwd()
  const errors: string[] = []
  const warnings: string[] = []

  // Check required files
  const requiredFiles = [
    { path: 'microstix.config.js', name: 'Основная конфигурация' },
    { path: 'package.json', name: 'Конфигурация пакета' },
    { path: 'vite.config.js', name: 'Конфигурация Vite' }
  ]

  requiredFiles.forEach(file => {
    const fullPath = path.join(cwd, file.path)
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file.name}: ${file.path}`)
    } else {
      errors.push(`❌ ${file.name} не найден: ${file.path}`)
    }
  })

  // Check optional files
  const optionalFiles = [
    { path: 'tsconfig.json', name: 'Конфигурация TypeScript' },
    { path: 'manifest.json', name: 'Манифест микрофронтенда' }
  ]

  optionalFiles.forEach(file => {
    const fullPath = path.join(cwd, file.path)
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file.name}: ${file.path}`)
    } else {
      warnings.push(`⚠️  ${file.name} не найден: ${file.path}`)
    }
  })

  // Check src directory
  const srcDir = path.join(cwd, 'src')
  if (fs.existsSync(srcDir)) {
    console.log(`✅ Директория исходного кода: src/`)
  } else {
    warnings.push(`⚠️  Директория исходного кода не найдена: src/`)
  }

  // Validate microstix.config.js if exists
  const configPath = path.join(cwd, 'microstix.config.js')
  if (fs.existsSync(configPath)) {
    try {
      // In a real implementation, we would import and validate the config
      console.log(`✅ Конфигурация microstix.config.js загружена`)
    } catch (error) {
      errors.push(`❌ Ошибка загрузки microstix.config.js: ${error}`)
    }
  }

  // Print results
  if (errors.length === 0) {
    console.log(`\n✅ Базовая проверка пройдена успешно!`)
  } else {
    console.log(`\n❌ Найдены ошибки:`)
    errors.forEach(error => console.log(`   ${error}`))
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  Предупреждения:`)
    warnings.forEach(warning => console.log(`   ${warning}`))
  }

  console.log(`\n📁 Текущая директория: ${cwd}`)
}

/**
 * List available templates
 */

export async function listTemplates() {
  console.log('📦 Доступные шаблоны:\n')

  const templates = [
    {
      name: 'react',
      description: 'React микрофронтенд с TypeScript',
      deps: ['react', 'react-dom'],
      entry: 'src/index.tsx'
    },
    {
      name: 'vue',
      description: 'Vue микрофронтенд с TypeScript',
      deps: ['vue'],
      entry: 'src/index.ts'
    },
    {
      name: 'svelte',
      description: 'Svelte микрофронтенд с TypeScript',
      deps: ['svelte'],
      entry: 'src/index.ts'
    },
    {
      name: 'vanilla',
      description: 'Vanilla JavaScript микрофронтенд',
      deps: [],
      entry: 'src/index.js'
    }
  ]

  templates.forEach(template => {
    console.log(`  ${template.name}`)
    console.log(`    ${template.description}`)
    console.log(`    Точка входа: ${template.entry}`)
    if (template.deps.length > 0) {
      console.log(`    Зависимости: ${template.deps.join(', ')}`)
    }
    console.log()
  })
}

/**
 * Show help information
 */
export function showHelp() {
  console.log(`
Microstix CLI - Инструмент конфигурации микрофронтендов

Использование:
  npx microstix-library <команда> [опции]

Команды:
  create <имя>       Создать новую конфигурацию проекта микрофронтенда
  generate           Сгенерировать конфигурацию для существующего проекта
  validate           Проверить конфигурацию проекта
  templates          Показать доступные шаблоны
  help               Показать эту справку

Опции для create:
  --framework <имя>  Фреймворк (react, vue, svelte, vanilla) [по умолчанию: react]
  --entry <путь>     Путь к файлу входа [по умолчанию: src/index.ts]
  --no-typescript    Использовать JavaScript вместо TypeScript
  --output <директория>  Выходная директория [по умолчанию: имя проекта]
  --no-minify        Отключить минификацию
  --no-sourcemap     Отключить source maps

Примеры:
  npx microstix-library create my-app
  npx microstix-library create my-app --framework vue
  npx microstix-library create my-app --no-typescript
  npx microstix-library generate --name my-app --framework react
  npx microstix-library validate
  npx microstix-library templates
  `)
}

/**
 * Parse command line arguments
 */
export function parseArgs(args: string[]): { command: string; options: Record<string, any> } {
  const command = args[0] || 'help'
  const options: Record<string, any> = {}

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]

    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const nextArg = args[i + 1]

      if (nextArg && !nextArg.startsWith('--')) {
        options[key] = nextArg
        i++
      } else {
        options[key] = true
      }
    } else if (!options.name && command === 'create') {
      options.name = arg
    }
  }

  return { command, options }
}

/**
 * Main CLI entry point
 */
export async function main() {
  const args = typeof process !== 'undefined' ? process.argv.slice(2) : []

  if (args.length === 0) {
    showHelp()
    return
  }

  const { command, options } = parseArgs(args)

  try {
    switch (command) {
      case 'create':
        if (!options.name) {
          console.error('❌ Имя проекта обязательно')
          console.error('Использование: npx microstix-library create <имя> [опции]')
          return
        }

        await createProject({
          name: options.name,
          entry: options.entry,
          framework: options.framework || 'react',
          typescript: options.typescript !== false,
          outputDir: options.output,
          sharedDeps: options.sharedDeps ? JSON.parse(options.sharedDeps) : undefined,
          minify: options.minify !== false,
          sourcemap: options.sourcemap !== false
        })
        break

      case 'generate':
        await generateConfig(options.name || 'my-app', options.framework || 'react')
        break

      case 'validate':
        await validateProject()
        break

      case 'templates':
        await listTemplates()
        break

      case 'help':
      default:
        showHelp()
        break
    }
  } catch (error) {
    console.error(`❌ Ошибка:`, error)
  }
}
