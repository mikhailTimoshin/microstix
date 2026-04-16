# Microstix

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.16.0-blue.svg)](https://www.npmjs.com/package/microstix)
[![Vite](https://img.shields.io/badge/Vite-5.0+-blue.svg)](https://vitejs.dev/)

**Microstix** — современная TypeScript библиотека для управления микрофронтендами с минимальной конфигурацией. Простая, легковесная и эффективная система для загрузки, регистрации и интеграции микрофронтендов в веб-приложениях.

## 🎯 Особенности

- **Минималистичный API** — интуитивно понятные функции для работы с микрофронтендами
- **Нулевые зависимости** — работает без внешних библиотек
- **TypeScript first** — полная типобезопасность из коробки
- **Автоматическая дедупликация** — скрипты загружаются только один раз
- **Поддержка Web Components** — встроенный компонент `<app-component>` для декларативной загрузки
- **Глобальный реестр** — централизованное управление микрофронтендами
- **Vite плагин** — официальный плагин для упрощения конфигурации сборки
- **JSX Runtime** — поддержка React JSX в production сборках
- **Общие библиотеки** — возможность шаринга зависимостей между микрофронтендами
- **Глобальное состояние** — встроенная система управления состоянием

## 📦 Установка

```bash
npm install microstix
```

Или прямая загрузка через CDN:

```html
<script src="https://unpkg.com/microstix"></script>
```

## 🚀 Быстрый старт

### 1. В хостовом приложении (host-app)

```typescript
import Microstix from 'microstix';

// Регистрация общих библиотек (React, ReactDOM и т.д.)
import React from 'react';
import ReactDOM from 'react-dom';
import ReactJsx from 'react/jsx-runtime';

Microstix.registerSharedLib('React', React, true);
Microstix.registerSharedLib('ReactDOM', ReactDOM, true);
Microstix.registerSharedLib('ReactJsx', ReactJsx, true);

// Загрузка микрофронтенда
Microstix.importModule('smartSearch', 'http://localhost:3001/smartSearch/src/index.js', (widgetData) => {
  console.log('Микрофронтенд загружен:', widgetData);
});
```

### 2. В микрофронтенде (remote-app)

```typescript
import Microstix from 'microstix';
import App from './components/App';

// Регистрация микрофронтенда
Microstix.exportModule('smartSearch', {
  name: 'smartSearch',
  version: '0.1.0',
  App, // Экспорт React компонента
});
```

### 3. Использование React компонента в хосте

```tsx
import { useState, useEffect } from 'react';
import Microstix from 'microstix';

function Component({ cfg, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const Cmp = Microstix.useSharedLib<Record<string, unknown>>(cfg.name)?.[cfg.obj];

  useEffect(() => {
    Microstix.importModule(
      cfg.name,
      cfg.src,
      (result) => {
        Microstix.registerStylesheet(cfg);
        Microstix.registerSharedLib(cfg.name, result);
        setLoaded(true);
      },
    );
  }, [cfg]);

  return loaded && <Cmp {...props} />;
}

// Использование
const cfg = {
  name: "smartSearch",
  obj: "App",
  src: "http://localhost:3001/smartSearch/src/index.js",
  rel: "http://localhost:3001/smartSearch/src/index.css",
};

<Component cfg={cfg} placeholder="Поиск" value={message} onChange={onChangeMessage} />
```

### 4. Использование Web Component

```html
<app-component 
  name="smartSearch" 
  src="http://localhost:3001/smartSearch/src/index.js"
  styles="http://localhost:3001/smartSearch/src/index.css">
</app-component>
```

## 📖 API Reference

### Основные функции

#### `Microstix.importModule(name: string, src: string, callback: (data: RegistryProps | undefined) => void): void`

Загружает микрофронтенд по указанному URL и вызывает callback с данными модуля.

```typescript
Microstix.importModule('smartSearch', '/static/smartSearch/bundle.js', (result) => {
  if (result) {
    console.log('Модуль загружен:', result.name, result.version);
  }
});
```

#### `Microstix.exportModule(name: string, props: RegistryProps): void`

Регистрирует микрофронтенд в глобальном реестре.

```typescript
Microstix.exportModule('smartSearch', {
  name: 'smartSearch',
  version: '0.1.0',
  App: MyComponent, // React компонент
  mount: (target) => { // Функция для ручного маунтинга
    const root = createRoot(target);
    root.render(<MyComponent />);
    return () => root.unmount();
  }
});
```

#### `Microstix.registerSharedLib(name: string, lib: unknown, global?: boolean): void`

Регистрирует общую библиотеку для использования в микрофронтендах.

```typescript
import React from 'react';
import ReactDOM from 'react-dom';

Microstix.registerSharedLib('React', React, true);
Microstix.registerSharedLib('ReactDOM', ReactDOM, true);
```

#### `Microstix.useSharedLib<T = unknown>(name: string): T | undefined`

Получает зарегистрированную общую библиотеку по имени.

```typescript
const React = Microstix.useSharedLib('React');
const Component = Microstix.useSharedLib('smartSearch')?.['App'];
```

#### `Microstix.importModuleAsync(name: string, src: string): Promise<RegistryProps | undefined>`

Асинхронная версия `importModule`.

```typescript
async function loadWidget() {
  const widgetData = await Microstix.importModuleAsync(
    'smartSearch',
    '/static/smartSearch/bundle.js'
  );
  if (widgetData) {
    console.log('Widget loaded:', widgetData);
  }
}
```

#### `Microstix.createStore<T extends Record<string, any>>(initial: T): T & {subscribe: (fn: (state: T) => void) => () => boolean}`

Создает реактивное хранилище состояния.

```typescript
const store = Microstix.createStore({
  count: 0,
  user: null,
});

// Подписка на изменения
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

// Изменение состояния
store.count = 1;
store.user = { name: 'John' };

// Отписка
unsubscribe();
```

#### `Microstix.registerStylesheet({name, rel, obj}: RegisterStylesheetProps): void`

Динамически загружает CSS стили для микрофронтенда.

```typescript
Microstix.registerStylesheet({
  name: 'smartSearch',
  rel: '/static/smartSearch/styles.css',
  obj: 'styles'
});
```

### TypeScript типы

```typescript
export type RegistryBaseProps = {
  name: string;
  version: string;
  mount?: (target: HTMLElement, context?: Record<string, unknown>) => (() => void) | undefined;
};

export type RegistryProps = RegistryBaseProps & Record<string, unknown>;

export type RegisterStylesheetProps = {
  name: string;
  rel: string;
  obj: string;
};

export type RegistryExporter = {
  default?: RegistryExporter;
  importModule: (
    name: string,
    src: string,
    resolve: (data: RegistryProps | undefined) => void
  ) => void;
  importModuleAsync: (name: string, src: string) => Promise<RegistryProps | undefined>;
  exportModule: (props: RegistryProps) => void;
  registerSharedLib: (name: string, lib: unknown, global?: boolean) => void;
  useSharedLib: <T = unknown>(name: string) => T | undefined;
  registerStylesheet: (cfg: RegisterStylesheetProps) => void;
  createStore: <T extends Record<string, any>>(initial: T) => T & {subscribe: (fn: (state: T) => void) => () => boolean};
};
```

### Web Component: `<app-component>`

Встроенный Web Component для декларативной загрузки микрофронтендов.

```html
<app-component 
  name="smartSearch" 
  src="/static/smartSearch/bundle.js"
  styles="/static/smartSearch/styles.css">
</app-component>
```

Атрибуты:
- `name` — имя микрофронтенда
- `src` — URL JavaScript файла
- `styles` — URL CSS файла (опционально)

## 🏗️ Архитектура

### Как это работает

1. **Регистрация библиотек**: Хостовое приложение регистрирует общие зависимости (React, ReactDOM и т.д.)
2. **Экспорт модулей**: Микрофронтенды регистрируют свои компоненты через `exportModule`
3. **Импорт модулей**: Хостовое приложение загружает микрофронтенды через `importModule`
4. **Шаринг зависимостей**: Общие библиотеки доступны всем микрофронтендам
5. **Изоляция стилей**: CSS загружается динамически через `registerStylesheet`

### Преимущества подхода

- **Простота интеграции**: Минимальный API, понятный даже новичкам
- **Производительность**: Дедупликация скриптов и ленивая загрузка
- **Гибкость**: Поддержка как React компонентов, так и Web Components
- **Безопасность**: Изоляция стилей и скриптов
- **TypeScript**: Полная поддержка типов из коробки

## 📁 Структура проекта

### Пример хостового приложения (host-app)

**package.json:**
```json
{
  "name": "microstix-host-app",
  "dependencies": {
    "microstix": "^1.16.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import { microstixHtmlPlugin } from 'microstix/vite-plugin';
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [react(), microstixHtmlPlugin(!isDev)],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "microstix"],
  },
})
```

**main.tsx:**
```typescript
import React from 'react'
import ReactJsx from 'react/jsx-runtime'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { registerSharedLib } from "microstix";
import './index.css'
import App from './App.tsx'

registerSharedLib('React', React, true)
registerSharedLib('ReactDOM', ReactDOM, true)
registerSharedLib('ReactJsx', ReactJsx, true)

createRoot(document.getElementById('root')!).render(<App />)
```

**App.tsx:**
```typescript
import Component from "./components/Component.tsx";
import {useState} from "react";

const cfg = {
  name: "smartSearch",
  obj: "App",
  src: "http://localhost:3001/smartSearch/src/index.js",
  rel: "http://localhost:3001/smartSearch/src/index.css",
}

function App() {
  const [message, setMessage] = useState("");
  
  return (
    <Component cfg={cfg}
               placeholder={"Поиск"}
               value={message}
               onChange={setMessage}>
    </Component>
  )
}
```

### Пример микрофронтенда (remote-app)

**package.json:**
```json
{
  "name": "smart-search",
  "dependencies": {
    "microstix": "^1.16.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import { microstixVitePlugin, getReactProd } from 'microstix/vite-plugin';
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [ 
    react(getReactProd(!isDev)), 
    microstixVitePlugin({
      name: `smartSearch`,
      component: 'src/index.tsx',
      sharedLibs: {
        'react': "React",
        "react-dom": "ReactDOM",
        'react/jsx-runtime': 'react/jsx-runtime',
      },
    })
  ]
})
```

**index.tsx:**
```typescript
import App from "./components/App/App.tsx";
import Microstix from "microstix";

Microstix.exportModule("smartSearch", {
  name: "smartSearch",
  version: "0.1.0",
  App,
});
```

**App.tsx:**
```typescript
import './App.css'

function App({ value, placeholder, onChange }) {
  return (
    <div className="smart-search-container">
      <input 
        placeholder={placeholder}
        value={value}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        type="text"
        name="smart-search"
        className="smart-search-input"
      />
      <div className="smart-search-icon">
        <img src={searchIcon} width={18} alt={placeholder} />
      </div>
    </div>
  );
}
```

## 🔧 Интеграция с Vite

### Плагин Vite для Microstix

#### Установка

Плагин входит в состав библиотеки и доступен по пути `microstix/vite-plugin`.

#### Базовое использование

**Для хостового приложения:**
```typescript
import { microstixHtmlPlugin } from 'microstix/vite-plugin';

export default defineConfig({
  plugins: [microstixHtmlPlugin(!isDev)],
});
```

**Для микрофронтенда:**
```typescript
import { microstixVitePlugin, getReactProd } from 'microstix/vite-plugin';

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [ 
    react(getReactProd(!isDev)), 
    microstixVitePlugin({
      name: `smartSearch`,
      component: 'src/index.tsx',
      sharedLibs: {
        'react': "React",
        "react-dom": "ReactDOM",
        'react/jsx-runtime': 'react/jsx-runtime',
      },
    })
  ]
})
```

### Преимущества плагина

- **Автоматическая конфигурация**: Настройка Rollup для микрофронтендов
- **Оптимизация сборки**: Правильная настройка external зависимостей
- **Dev сервер**: Автоматический запуск dev сервера на отдельном порту
- **JSX Runtime**: Поддержка React JSX в production

## 📊 Производительность

- **Дедупликация скриптов**: Каждый скрипт загружается только один раз
- **Ленивая загрузка**: Модули загружаются по требованию
- **Кэширование**: Результаты загрузки кэшируются в памяти
- **Минимальный размер**: Библиотека ~5KB в сжатом виде

## 🔒 Безопасность

- **Изоляция скриптов**: Каждый микрофронтенд работает в своем контексте
- **Валидация источников**: Проверка URL перед загрузкой
- **CORS поддержка**: Правильная настройка cross-origin запросов
- **Content Security Policy**: Совместимость с современными политиками безопасности

## 🤝 Совместимость

### Браузеры

- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 79+

### Фреймворки

- React 16.8+
- Vue 3.x (через Web Components)
- Angular (через Web Components)
- Любой фреймворк с поддержкой Custom Elements

### Сборщики

- Vite 5.0+
- Webpack 5.x (через настройку external)
- Rollup (нативная поддержка)

## 📞 Поддержка

### Часто задаваемые вопросы

**Q: Как загрузить несколько микрофронтендов параллельно?**
A: Используйте `Promise.all` с `importModuleAsync`:
```typescript
const [module1, module2] = await Promise.all([
  Microstix.importModuleAsync('module1', '/module1.js'),
  Microstix.importModuleAsync('module2', '/module2.js'),
]);
```

**Q: Как обновить микрофронтенд без перезагрузки страницы?**
A: Используйте версионирование в имени модуля:
```typescript
Microstix.exportModule('my-widget-v2', { ... });
```

**Q: Как передать пропсы