# Microstix Library

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Microstix** — это TypeScript библиотека для управления микрофронтендами и микросервисами в корпоративных порталах. Библиотека предоставляет минимальную конфигурацию, централизованный реестр и систему событий для управления зависимостями, компонентами и сервисами.

## 🎯 Особенности

- **Минимальная конфигурация** — простые JSON конфигурации вместо сложных Vite/Webpack конфигов
- **Централизованный реестр** — единый источник истины для зависимостей, компонентов и сервисов
- **Система событий** — отслеживание изменений в реестре в реальном времени
- **UMD/USM модули** — поддержка современных форматов для микрофронтендов
- **CLI инструменты** — быстрая генерация проектов и конфигураций
- **TypeScript first** — полная типобезопасность

## 📦 Установка

```bash
# Установка как зависимости
npm install microstix-library

# Или использование через npx
npx microstix-library create my-app
```

## 🚀 Быстрый старт

### 1. Создание микрофронтенда

```bash
# Создать новый проект микрофронтенда
npx microstix-library create my-microfront --framework react

# Перейти в директорию проекта
cd my-microfront

# Установить зависимости
npm install

# Запустить разработку
npm run dev

# Собрать проект
npm run build
```

### 2. Использование в хостовом приложении

```javascript
import { importMicrofront, addComponent, registryEvents } from 'microstix-library';

// Добавление компонента в реестр
addComponent({
  name: 'MyComponent',
  type: 'react',
  version: '1.0.0',
  exports: ['MyComponent'],
  dependencies: ['react', 'react-dom']
});

// Подписка на события
registryEvents.on('component:added', (event) => {
  console.log(`Компонент добавлен: ${event.data.name}`);
});

// Загрузка микрофронтенда
importMicrofront('/path/to/microfront.umd.js', 'my-microfront', (result) => {
  if (result.component) {
    // Инициализация микрофронтенда
    const unmount = window.my_microfront.init('container-id', {
      title: 'Мой микрофронтенд'
    });
    
    // Очистка при размонтировании
    // unmount();
  }
});
```

## 📁 Структура проекта

```
my-microfront/
├── src/
│   ├── index.ts          # Точка входа микрофронтенда
│   └── App.tsx           # React компонент
├── microstix.config.js   # Конфигурация Microstix
├── vite.config.js        # Конфигурация Vite
├── package.json          # Зависимости проекта
├── tsconfig.json         # Конфигурация TypeScript
└── manifest.json         # Манифест микрофронтенда
```

## ⚙️ Конфигурация

### microstix.config.js

```javascript
// microstix.config.js
export default {
  name: 'my-microfront',
  entry: 'src/index.ts',
  version: '1.0.0',
  sharedDeps: {
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
    }
  },
  build: {
    formats: ['umd', 'es'],
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    fileName: '[name].[format].js'
  },
  exports: {
    components: [],
    services: []
  },
  metadata: {
    type: 'microfrontend',
    framework: 'react',
    environment: 'browser'
  }
};
```

## 🔧 API Reference

### Реестр (Registry)

#### Зависимости
```typescript
import { addSharedDependency, getSharedDependency } from 'microstix-library';

// Добавление зависимости
addSharedDependency({
  name: 'react',
  version: '^18.2.0',
  global: 'React',
  import: 'react'
});

// Получение зависимости
const react = getSharedDependency('react');
```

#### Компоненты
```typescript
import { addComponent, getComponent } from 'microstix-library';

// Добавление компонента
addComponent({
  name: 'Header',
  type: 'react',
  version: '1.0.0',
  exports: ['Header', 'HeaderLogo'],
  dependencies: ['react', 'react-dom']
});

// Получение компонента
const header = getComponent('Header');
```

#### Сервисы
```typescript
import { addService, getService } from 'microstix-library';

// Добавление сервиса
addService({
  name: 'AuthService',
  type: 'authentication',
  version: '1.0.0',
  methods: ['login', 'logout', 'getUser'],
  dependencies: []
});

// Получение сервиса
const authService = getService('AuthService');
```

### Система событий

```typescript
import { registryEvents, createDebugLogger } from 'microstix-library';

// Подписка на события
const unsubscribe = registryEvents.on('component:added', (event) => {
  console.log('Компонент добавлен:', event.data.name);
});

// Подписка на одно событие
registryEvents.once('registry:cleared', () => {
  console.log('Реестр очищен');
});

// Отладка всех событий
const debugUnsubscribe = createDebugLogger('[Microstix]');

// Отписка от событий
unsubscribe();
debugUnsubscribe();
```

### Загрузчик микрофронтендов

```typescript
import { importMicrofront } from 'microstix-library';

// Загрузка микрофронтенда
importMicrofront('/path/to/microfront.umd.js', 'microfront-name', (result) => {
  console.log('Загружено:', result);
  
  // result содержит:
  // - component: компонент из реестра
  // - service: сервис из реестра
});
```

## 📊 CLI Команды

```bash
# Создать новый проект
npx microstix-library create <name> [options]

# Опции:
#   --framework <name>    Фреймворк (react, vue, svelte, vanilla)
#   --entry <path>        Путь к файлу входа
#   --no-typescript       Использовать JavaScript
#   --output <dir>        Выходная директория
#   --no-minify           Отключить минификацию
#   --no-sourcemap        Отключить source maps

# Примеры:
npx microstix-library create my-app
npx microstix-library create my-app --framework vue
npx microstix-library create my-app --no-typescript

# Показать доступные шаблоны
npx microstix-library templates

# Проверить конфигурацию проекта
npx microstix-library validate

# Сгенерировать конфигурацию
npx microstix-library generate --name my-app --framework react
```

## 🎨 Шаблоны

Microstix поддерживает несколько шаблонов:

- **react** — React микрофронтенд с TypeScript
- **vue** — Vue микрофронтенд с TypeScript  
- **svelte** — Svelte микрофронтенд с TypeScript
- **vanilla** — Vanilla JavaScript микрофронтенд

## 🔍 Примеры

### Пример 1: Базовое использование

```javascript
// examples/basic-usage.js
const { addComponent, getComponent, clearRegistry } = require('microstix-library');

// Добавление компонента
addComponent({
  name: 'Button',
  type: 'react',
  version: '1.0.0',
  exports: ['Button'],
  dependencies: ['react']
});

// Получение компонента
const button = getComponent('Button');
console.log('Компонент:', button);

// Очистка реестра
clearRegistry();
```

### Пример 2: Система событий

```javascript
// examples/events-example.js
const { registryEvents, addComponent, createDebugLogger } = require('microstix-library');

// Включение отладки
const debugUnsubscribe = createDebugLogger('[Events]');

// Подписка на события
registryEvents.on('component:added', (event) => {
  console.log(`📦 Добавлен: ${event.data.name}`);
});

// Добавление компонента (вызовет событие)
addComponent({
  name: 'Modal',
  type: 'react',
  version: '1.0.0',
  exports: ['Modal'],
  dependencies: ['react']
});

// Отключение отладки
debugUnsubscribe();
```

## 📈 Производительность

- **Минимальный размер** — библиотека имеет минимальные зависимости
- **Быстрая загрузка** — UMD модули загружаются асинхронно
- **Эффективный реестр** — O(1) доступ к элементам реестра
- **Оптимизированные события** — система событий не влияет на производительность

## 🔒 Безопасность

- **Изоляция** — каждый микрофронтенд работает в изолированном контексте
- **Валидация** — все данные в реестре проходят базовую валидацию
- **Безопасные события** — обработчики событий защищены от исключений

## 🤝 Совместимость

- **Браузеры**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Node.js**: 16+
- **TypeScript**: 5.0+
- **Фреймворки**: React 18+, Vue 3+, Svelte 4+

## 🚨 Ограничения

- Не предоставляет маршрутизацию между микрофронтендами
- Не синхронизирует состояние между микрофронтендами
- Не поддерживает серверный рендеринг из коробки
- Требует ручного управления зависимостями

## 📄 Лицензия

MIT License © 2024 Microstix Team

## 👥 Команда

- **Разработчик**: [Ваше Имя]
- **Контрибьюторы**: [Список контрибьюторов]

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/yourusername/microstix-library/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/microstix-library/discussions)
- **Email**: support@microstix.com

---

**Microstix** делает микрофронтенды простыми и управляемыми. Начните создавать масштабируемые корпоративные порталы уже сегодня! 🚀