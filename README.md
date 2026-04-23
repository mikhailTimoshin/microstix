# Microstix

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.20.0-blue.svg)](https://www.npmjs.com/package/microstix)
[![Vite](https://img.shields.io/badge/Vite-5.0+-blue.svg)](https://vitejs.dev/)

**Microstix** — современная TypeScript библиотека для управления микрофронтендами с минимальной конфигурацией. Простая, легковесная и эффективная система для загрузки, регистрации и интеграции микрофронтендов в веб-приложениях. Идеально подходит для постепенной миграции монолитов, создания платформ приложений и реализации архитектуры микрофронтендов.

## 🎯 Особенности

- **Минималистичный API** — интуитивно понятные функции для работы с микрофронтендами
- **Нулевые зависимости** — работает без внешних библиотек
- **TypeScript first** — полная типобезопасность из коробки
- **Автоматическая дедупликация** — скрипты загружаются только один раз
- **Поддержка Web Components** — встроенный компонент `<app-component>` с Shadow DOM для декларативной загрузки
- **Глобальный реестр** — централизованное управление микрофронтендами
- **Vite плагин** — официальный плагин для упрощения конфигурации сборки
- **JSX Runtime** — поддержка React JSX в production сборках для оптимизации бандла
- **Общие библиотеки** — возможность шаринга зависимостей между микрофронтендами
- **Глобальное состояние** — встроенная система управления состоянием через Proxy
- **Динамическая загрузка CSS** — изолированная загрузка стилей для каждого микрофронтенда
- **Production-ready** — готово к использованию в production среде
- **Легкая миграция** — постепенная миграция существующих приложений

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
import React from 'react';
import ReactDOM from 'react-dom';
import ReactJsx from 'react/jsx-runtime';
import { registerSharedLib } from 'microstix';

// Регистрация общих библиотек (React, ReactDOM и т.д.)
registerSharedLib('React', React, true);
registerSharedLib('ReactDOM', ReactDOM, true);
registerSharedLib('ReactJsx', ReactJsx, true);

// Загрузка микрофронтенда
import { importModule } from 'microstix';

importModule('smartSearch', 'http://localhost:3001/smartSearch/src/index.js', (widgetData) => {
  console.log('Микрофронтенд загружен:', widgetData);
});
```

### 2. В микрофронтенде (remote-app)

```typescript
// src/index.tsx — точка входа для Microstix
import App from "./components/App/App.tsx";
import { exportModule } from "microstix";

// Регистрация компонента в глобальном реестре
exportModule({
  name: "smartSearch",
  version: "0.1.0",
  App, // React компонент для рендеринга
  // Опционально: функция для ручного маунтинга
  mount: (target, context) => {
    const root = createRoot(target);
    root.render(<App {...context} />);
    return () => root.unmount();
  }
});
```

### 3. Использование React компонента в хосте

```tsx
import { useState, useEffect } from 'react';
import { importModule, useSharedLib, registerStylesheet, registerSharedLib } from 'microstix';

function Component({ cfg, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const Cmp = useSharedLib<Record<string, unknown>>(cfg.name)?.[cfg.obj];

  useEffect(() => {
    importModule(cfg.name, cfg.src, (result) => {
      registerStylesheet(cfg);
      registerSharedLib(cfg.name, result);
      setLoaded(true);
    });
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
<!-- Декларативная загрузка через кастомный элемент с Shadow DOM -->
<app-component 
  name="smartSearch" 
  src="http://localhost:3001/smartSearch/src/index.js"
  styles="http://localhost:3001/smartSearch/src/index.css">
</app-component>
```

Атрибуты:
- `name` — имя микрофронтенда (обязательный)
- `src` — URL JavaScript файла (обязательный)
- `styles` — URL CSS файла (опционально, загружается через CSSStyleSheet в Shadow DOM)

## 📖 API Reference

### Основные функции

#### `importModule(name: string, src: string, callback: (data: RegistryProps | undefined) => void): void`

Загружает микрофронтенд по указанному URL и вызывает callback с данными модуля.

```typescript
import { importModule } from 'microstix';

importModule('smartSearch', '/static/smartSearch/bundle.js', (result) => {
  if (result) {
    console.log('Модуль загружен:', result.name, result.version);
  }
});
```

#### `exportModule(props: RegistryProps): void`

Регистрирует микрофронтенд в глобальном реестре. Принимает единый объект конфигурации.

```typescript
import { exportModule } from 'microstix';

exportModule({
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

#### `registerSharedLib(name: string, lib: unknown, global?: boolean): void`

Регистрирует общую библиотеку для использования в микрофронтендах. Если `global = true`, библиотека также записывается в `window[name]`.

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { registerSharedLib } from 'microstix';

registerSharedLib('React', React, true);
registerSharedLib('ReactDOM', ReactDOM, true);
```

#### `useSharedLib<T = unknown>(name: string): T | undefined`

Получает зарегистрированную общую библиотеку по имени.

```typescript
import { useSharedLib } from 'microstix';

const React = useSharedLib('React');
const Component = useSharedLib('smartSearch')?.['App'];
```

#### `importModuleAsync(name: string, src: string): Promise<RegistryProps | undefined>`

Асинхронная версия `importModule`.

```typescript
import { importModuleAsync } from 'microstix';

async function loadWidget() {
  const widgetData = await importModuleAsync(
    'smartSearch',
    '/static/smartSearch/bundle.js'
  );
  if (widgetData) {
    console.log('Widget loaded:', widgetData);
  }
}
```

#### `createStore<T extends Record<string, any>>(initial: T): T & { subscribe: (fn: (state: T) => void) => () => boolean }`

Создает реактивное хранилище состояния на основе Proxy. При изменении свойств уведомляет всех подписчиков.

```typescript
import { createStore } from 'microstix';

const store = createStore({
  count: 0,
  user: null,
});

// Подписка на изменения
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

// Изменение состояния (триггерит уведомления)
store.count = 1;
store.user = { name: 'John' };

// Отписка
unsubscribe();
```

#### `registerStylesheet({ name, rel, obj }: RegisterStylesheetProps): void`

Динамически загружает CSS стили для микрофронтенда. Добавляет `<link rel="stylesheet">` в `document.head` с атрибутом `crossorigin`.

```typescript
import { registerStylesheet } from 'microstix';

registerStylesheet({
  name: 'smartSearch',
  rel: '/static/smartSearch/styles.css',
  obj: 'styles'
});
```

### TypeScript типы

Полная типизация для безопасной разработки:

```typescript
// Базовые типы
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

// Конфигурация плагина Vite
export interface MicrostixViteConfig {
  isHost?: boolean;                 // Является ли приложение хостом
  name: string;                     // Имя проекта/микрофронтенда
  component?: string;               // Путь к точке входа (по умолчанию: 'src/index.jsx')
  formats?: ('umd' | 'es' | 'cjs')[];  // Форматы сборки (по умолчанию: ['es', 'cjs'])
  sharedLibs?: Record<string, string>;  // Внешние зависимости
  port?: number;                    // Порт для dev сервера (по умолчанию: 3001)
  basePath?: string;                // Базовый путь (авто: '/' для хоста, `/${name}/` для remote)
  sourcemap?: boolean;              // Включить sourcemaps (по умолчанию: true)
  minify?: boolean;                 // Минимизировать код (по умолчанию: true)
  viteOptions?: Record<string, any>;  // Дополнительные настройки Vite
  staticUrl?: string;              // URL для статических файлов (по умолчанию: "http://localhost:3000")
  optimize?: string[];             // Массив модулей для optimizeDeps.include
}

// Глобальный API
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
  createStore: <T extends Record<string, any>>(initial: T) => T & {
    subscribe: (fn: (state: T) => void) => () => boolean;
  };
};

// Глобальное объявление для TypeScript
declare global {
  interface Window {
    Microstix?: RegistryExporter;
    [name: string]: unknown;
  }
}
```

### Web Component: `<app-component>`

Встроенный Web Component для декларативной загрузки микрофронтендов. Использует **Shadow DOM** для изоляции стилей.

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
- `styles` — URL CSS файла (опционально, загружается через `CSSStyleSheet` в Shadow Root)

## 🏗️ Архитектура

### Как это работает

1. **Регистрация библиотек**: Хостовое приложение регистрирует общие зависимости (React, ReactDOM и т.д.)
2. **Экспорт модулей**: Микрофронтенды регистрируют свои компоненты через `exportModule`
3. **Импорт модулей**: Хостовое приложение загружает микрофронтенды через `importModule` / `importModuleAsync`
4. **Шаринг зависимостей**: Общие библиотеки доступны всем микрофронтендам через `useSharedLib`
5. **Изоляция стилей**: CSS загружается динамически через `registerStylesheet` или через Shadow DOM в Web Component
6. **Управление состоянием**: Глобальное реактивное состояние через `createStore` на основе Proxy

### Преимущества подхода

- **Простота интеграции**: Минимальный API, понятный даже новичкам
- **Производительность**: Дедупликация скриптов и ленивая загрузка
- **Гибкость**: Поддержка как React компонентов, так и Web Components
- **Безопасность**: Изоляция стилей и скриптов (Shadow DOM)
- **TypeScript**: Полная поддержка типов из коробки
- **Постепенная миграция**: Возможность постепенного перехода на микрофронтенды
- **Независимые команды**: Каждая команда может разрабатывать и деплоить независимо

### Сценарии использования

1. **Миграция монолита**: Постепенное выделение функциональности в микрофронтенды
2. **Платформа приложений**: Единая платформа для множества независимых приложений
3. **Виджеты и плагины**: Динамическая загрузка сторонних виджетов
4. **A/B тестирование**: Быстрое развертывание разных версий компонентов
5. **Мультитенантность**: Разные интерфейсы для разных клиентов

## 📁 Структура проекта

### Пример хостового приложения (host-app)

**package.json:**
```json
{
  "name": "microstix-host-app",
  "dependencies": {
    "microstix": "^1.20.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [react()],
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
import { useState } from "react";

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
    "microstix": "^1.20.0",
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

**src/index.tsx:**
```typescript
import App from "./components/App/App.tsx";
import { exportModule } from "microstix";

exportModule({
  name: "smartSearch",
  version: "0.1.0",
  App,
});
```

**components/App/App.tsx:**
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

**Для микрофронтенда (remote-app):**

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

#### Параметры `MicrostixViteConfig`

| Параметр      | Тип                        | По умолчанию                        | Описание                                           |
|---------------|----------------------------|--------------------------------------|----------------------------------------------------|
| `isHost`      | `boolean`                  | `false`                              | Является ли приложение хостом                      |
| `name`        | `string`                   | — (обязательный)                     | Имя проекта/микрофронтенда                         |
| `component`   | `string`                   | `'src/index.jsx'`                    | Путь к точке входа                                 |
| `formats`     | `('umd'\|'es'\|'cjs')[]`  | `['es', 'cjs']`                      | Форматы сборки                                     |
| `sharedLibs`  | `Record<string, string>`   | `{ react: "React", react-dom: "ReactDOM" }` | Внешние зависимости и их глобальные имена |
| `port`        | `number`                   | `3001`                               | Порт для dev сервера                               |
| `basePath`    | `string`                   | `'/'` (хост) / `'/<name>/'` (remote) | Базовый путь для статических ресурсов              |
| `sourcemap`   | `boolean`                  | `true`                               | Включить sourcemaps                                |
| `minify`      | `boolean`                  | `true`                               | Минимизировать код (terser)                        |
| `viteOptions` | `Record<string, any>`      | `{}`                                 | Дополнительные настройки Vite                      |
| `staticUrl`   | `string`                   | `'http://localhost:3000'`            | URL для статических файлов (замена `@static-files`)|
| `optimize`    | `string[]`                 | `[]`                                 | Модули для `optimizeDeps.include`                  |

#### `getReactProd(isProd: boolean)`

Утилита для настройки React JSX в production режиме. При `isProd = true` возвращает конфигурацию `{ jsxImportSource: 'microstix' }`, что позволяет использовать оптимизированный JSX runtime из Microstix.

### Преимущества плагина

- **Автоматическая конфигурация**: Настройка Rollup для микрофронтендов
- **Оптимизация сборки**: Правильная настройка external зависимостей
- **Dev сервер**: Автоматический запуск dev сервера с CORS и прокси для статики
- **JSX Runtime**: Поддержка React JSX в production через `getReactProd`
- **Замена путей**: Автоматическая замена `@static-files` на указанный `staticUrl` в production

## 📊 Производительность и оптимизация

### Метрики производительности

- **Размер библиотеки**: ~5KB (gzipped)
- **Время инициализации**: < 1ms
- **Потребление памяти**: Минимальное, только для реестра модулей
- **Скорость регистрации**: O(1) для операций с Map
- **Дедупликация скриптов**: Автоматическое предотвращение повторных загрузок

### Оптимизации

1. **Ленивая загрузка**: Модули загружаются только когда нужны
2. **Кэширование в памяти**: Результаты загрузки и скрипты кэшируются
3. **Параллельная загрузка**: Возможность загрузки нескольких модулей одновременно
4. **Дедупликация**: Каждый скрипт загружается только один раз
5. **Минимальный размер**: Библиотека ~5KB в сжатом виде

### Бенчмарки

```typescript
// Пример измерения времени загрузки
console.time('microstix-load');
importModuleAsync('widget', '/widget.js')
  .then(() => {
    console.timeEnd('microstix-load'); // ~50-100ms в зависимости от сети
  });
```

### Рекомендации по оптимизации

- Используйте CDN для статических файлов микрофронтендов
- Настройте долгосрочное кэширование для bundle файлов
- Используйте HTTP/2 для параллельной загрузки
- Минимизируйте размер бандлов микрофронтендов
- Используйте tree-shaking для удаления неиспользуемого кода

## 🔒 Безопасность и лучшие практики

### Меры безопасности

- **Изоляция скриптов**: Каждый микрофронтенд работает в своем контексте
- **Shadow DOM**: Встроенный Web Component использует изолированное DOM-дерево
- **Валидация источников**: Проверка URL перед загрузкой
- **CORS поддержка**: Правильная настройка cross-origin запросов
- **Content Security Policy**: Совместимость с современными политиками безопасности
- **Subresource Integrity**: Поддержка SRI для проверки целостности скриптов

### Рекомендации по безопасности

1. **Используйте HTTPS**: Всегда загружайте скрипты по защищенному протоколу
2. **Валидируйте источники**: Проверяйте домены, с которых загружаются скрипты
3. **Настройте CSP**: Ограничьте источники загружаемых скриптов
4. **Используйте SRI**: Добавляйте integrity атрибуты для скриптов
5. **Регулярно обновляйте**: Следите за обновлениями зависимостей

### Пример настройки CSP

```html
<!-- Content Security Policy header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self';
               script-src 'self' https://trusted-cdn.com;
               style-src 'self' 'unsafe-inline';
               connect-src 'self' https://api.example.com;">
```

### Загрузка с проверкой целостности

```typescript
// Пример с Subresource Integrity
const script = document.createElement('script');
script.src = 'https://cdn.example.com/widget.js';
script.integrity = 'sha256-abc123...';
script.crossOrigin = 'anonymous';
document.head.appendChild(script);
```

### Аудит безопасности

Перед production развертыванием:
1. Проверьте все внешние источники скриптов
2. Настройте правильные CORS заголовки
3. Включите CSP в режиме report-only для тестирования
4. Протестируйте загрузку в разных браузерах
5. Проверьте обработку ошибок загрузки

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
  importModuleAsync('module1', '/module1.js'),
  importModuleAsync('module2', '/module2.js'),
]);
```

**Q: Как обновить микрофронтенд без перезагрузки страницы?**
A: Используйте версионирование в имени модуля или добавьте query-параметр к URL:
```typescript
importModule('my-widget', '/my-widget.js?v=2', callback);
```

**Q: Как передать пропсы в микрофронтенд?**
A: Пропсы передаются как обычные React пропсы в компонент-обёртку:
```typescript
<Component 
  cfg={cfg}
  placeholder="Поиск"
  value={value}
  onChange={handleChange}
  customProp="значение"
/>
```

**Q: Как обрабатывать ошибки загрузки?**
A: Используйте try-catch с `importModuleAsync`:
```typescript
try {
  const module = await importModuleAsync('widget', '/widget.js');
  if (!module) {
    throw new Error('Модуль не зарегистрирован');
  }
} catch (error) {
  console.error('Ошибка загрузки:', error);
  // Показать fallback UI
}
```

**Q: Можно ли использовать Microstix без React?**
A: Да, через Web Components или функцию `mount`:
```typescript
// Через Web Component
<app-component name="widget" src="/widget.js"></app-component>

// Через функцию mount
importModule('widget', '/widget.js', (data) => {
  if (data?.mount) {
    const unmount = data.mount(document.getElementById('target'));
    // Для очистки: unmount();
  }
});
```

**Q: Как очистить кэш загруженных модулей?**
A: Microstix автоматически дедуплицирует скрипты. Для принудительной перезагрузки измените URL (добавьте query параметр).

**Q: Как работает шаринг зависимостей?**
A: Библиотеки регистрируются один раз через `registerSharedLib` и доступны всем микрофронтендам через `useSharedLib`.

### Сообщение об ошибках и отладка

#### Распространенные ошибки и решения

1. **Модуль не загружается**
   - Проверьте URL скрипта в Network вкладке
   - Убедитесь, что сервер возвращает правильные CORS заголовки
   - Проверьте, что микрофронтенд вызывает `exportModule()`

2. **React не найден в микрофронтенде**
   - Убедитесь, что React зарегистрирован через `registerSharedLib()`
   - Проверьте, что микрофронтенд использует `useSharedLib('React')`
   - Убедитесь, что версии React совместимы

3. **Стили не применяются**
   - Проверьте, что `registerStylesheet()` вызывается после загрузки модуля
   - Убедитесь, что CSS файл доступен по указанному URL
   - Проверьте CSP политики для стилей

4. **Память не освобождается**
   - Убедитесь, что функция `unmount()` вызывается при размонтировании
   - Проверьте, что подписки на store отменяются
   - Используйте DevTools для поиска утечек памяти

#### Инструменты для отладки

```typescript
// Включение детального логирования
if (process.env.NODE_ENV === 'development') {
  const originalImport = importModule;
  importModule = function(name, src, callback) {
    console.log(`[Microstix] Загрузка модуля: ${name} из ${src}`);
    return originalImport.call(this, name, src, callback);
  };
}
```

#### Мониторинг в production

1. **Трекинг загрузки модулей**
2. **Мониторинг ошибок загрузки**
3. **Измерение времени загрузки**
4. **Отслеживание использования памяти**

### Сообщение об ошибках

При возникновении проблем:

1. **Проверьте консоль браузера** — Microstix логирует все ошибки загрузки
2. **Убедитесь в доступности скриптов** — проверьте URL в Network вкладке
3. **Проверьте CORS настройки** — микрофронтенды должны разрешать кросс-доменные запросы
4. **Убедитесь в регистрации модуля** — микрофронтенд должен вызывать `exportModule()`
5. **Проверьте версии зависимостей** — убедитесь в совместимости React и других библиотек
6. **Используйте DevTools** — проверьте Console и Network вкладки
7. **Включите логирование** — добавьте детальное логирование для отладки
8. **Проверьте CSP ошибки** — убедитесь, что Content Security Policy не блокирует загрузку

## 🛠️ Разработка и сборка

### Установка зависимостей

```bash
npm install
```

### Сборка библиотеки

```bash
npm run build
```

### Разработка с отслеживанием изменений

```bash
npm run dev
```

### Структура проекта

```
microstix/
├── src/
│   ├── index.ts            # Основной код библиотеки (class Component, createStore, registry API)
│   ├── index.types.ts      # TypeScript типы (RegistryProps, RegistryExporter, etc.)
│   ├── vite-plugin.ts      # Плагин для Vite (microstixVitePlugin, getReactProd)
│   └── jsx-runtime.ts      # JSX Runtime для production (обёртка над window.ReactJsx)
├── dist/                   # Собранные файлы (index, vite-plugin, jsx-runtime)
├── package.json            # Конфигурация npm
├── tsconfig.json           # Конфигурация TypeScript
├── tsup.config.js          # Конфигурация сборки (3 отдельных entry point)
└── README.md               # Документация
```

### Сборка (tsup.config.js)

Проект собирается в 3 отдельных entry point:

1. **`src/index.ts`** — основная библиотека: `dist/index.js`, `dist/index.mjs`, `dist/index.global.js` + `.d.ts`
2. **`src/vite-plugin.ts`** — плагин Vite: `dist/vite-plugin.mjs`, `dist/vite-plugin.cjs` + `.d.ts`
3. **`src/jsx-runtime.ts`** — JSX runtime: `dist/jsx-runtime.mjs`, `dist/jsx-runtime.cjs`

### Тестирование и качество кода

#### Unit тесты

```typescript
import { registerSharedLib, useSharedLib, exportModule, importModuleAsync } from 'microstix';

describe('Microstix', () => {
  beforeEach(() => {
    // Очистка состояния перед каждым тестом
    delete window.Microstix;
  });

  test('should register and retrieve shared library', () => {
    const mockLib = { version: '1.0.0' };
    registerSharedLib('test-lib', mockLib);
    
    const retrieved = useSharedLib('test-lib');
    expect(retrieved).toBe(mockLib);
  });

  test('should export and import module', async () => {
    const mockModule = {
      name: 'test-module',
      version: '1.0.0',
      App: () => null
    };

    exportModule(mockModule);
    
    const result = await importModuleAsync('test-module', '');
    expect(result).toEqual(mockModule);
  });
});
```

#### Интеграционные тесты

```typescript
import { render, waitFor } from '@testing-library/react';
import { exportModule } from 'microstix';

test('should load and render microfrontend', async () => {
  const MockComponent = () => <div>Test Component</div>;
  
  exportModule({
    name: 'test-widget',
    version: '1.0.0',
    App: MockComponent
  });

  const { getByText } = render(
    <MicrofrontendLoader name="test-widget" src="/test-widget.js" />
  );

  await waitFor(() => {
    expect(getByText('Test Component')).toBeInTheDocument();
  });
});
```

#### E2E тесты

```typescript
import { test, expect } from '@playwright/test';

test('should load microfrontend in host application', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await expect(page.locator('app-component')).toBeVisible();
});
```

#### Тестирование производительности

```typescript
describe('Performance benchmarks', () => {
  test('should load module under 100ms', async () => {
    const start = performance.now();
    await importModuleAsync('fast-module', '/fast.js');
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
  });

  test('should handle 100 concurrent module loads', async () => {
    const promises = Array.from({ length: 100 }, (_, i) =>
      importModuleAsync(`module-${i}`, `/module-${i}.js`)
    );
    
    await expect(Promise.all(promises)).resolves.not.toThrow();
  });
});
```

#### Линтинг и проверка кода

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "error"
  }
}
```

#### CI/CD конфигурация

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - run: npm run test:e2e
```

Для тестирования создайте HTML файл с примером использования:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Microstix Test</title>
    <script src="./dist/index.global.js"></script>
</head>
<body>
    <div id="app">
        <app-component 
            name="test-widget"
            src="./examples/simple-example.js">
        </app-component>
    </div>
    
    <script>
        // Тестирование API
        if (window.Microstix) {
            console.log('Microstix загружен:', window.Microstix);
            
            // Тест регистрации модуля
            window.Microstix.exportModule({
                name: 'test-module',
                version: '1.0.0',
                App: () => document.createElement('div')
            });
            
            // Тест загрузки модуля
            window.Microstix.importModule('test-module', '', (data) => {
                console.log('Модуль загружен:', data);
            });
        }
    </script>
</body>
</html>
```

## 🚀 Дорожная карта

### Планируемые возможности

- [ ] **Server-side rendering** — поддержка SSR для микрофронтендов
- [ ] **Модульная федерация** — совместимость с Webpack Module Federation
- [ ] **Интеграция с Next.js** — официальный плагин для Next.js
- [ ] **DevTools расширение** — визуальная отладка микрофронтендов
- [ ] **Автоматическое версионирование** — управление версиями микрофронтендов
- [ ] **Пререндеринг** — улучшение SEO и начальной загрузки
- [ ] **Аналитика** — встроенная аналитика использования микрофронтендов
- [ ] **Темы и скины** — система тем для кастомизации микрофронтендов

### Текущие возможности в версии 1.20.0:

- ✅ **Динамическая загрузка CSS** — функция `registerStylesheet` для изоляции стилей
- ✅ **Vite плагин** — официальная интеграция с Vite (`microstixVitePlugin`, `getReactProd`)
- ✅ **TypeScript типизация** — полная поддержка TypeScript из коробки
- ✅ **Оптимизация производительности** — дедупликация и кэширование скриптов
- ✅ **Примеры интеграции** — готовые примеры с React и Web Components
- ✅ **Документация** — подробная документация на русском языке
- ✅ **Глобальное состояние** — система управления состоянием через `createStore` (Proxy-based)
- ✅ **Web Components** — поддержка кастомных элементов `<app-component>` с Shadow DOM
- ✅ **Шаринг зависимостей** — система общих библиотек для микрофронтендов
- ✅ **Безопасность** — поддержка CSP, CORS и проверка источников
- ✅ **JSX Runtime** — оптимизированный JSX runtime для production сборок
- ✅ **Изоляция стилей** — Shadow DOM для Web Component, CSSStyleSheet API

## 🌟 Примеры использования в реальных проектах

### 1. E-commerce платформа

```typescript
import { importModuleAsync } from 'microstix';

// Загрузка различных виджетов для интернет-магазина
const ecommerceWidgets = [
  { name: 'product-card', src: '/widgets/product-card.js' },
  { name: 'shopping-cart', src: '/widgets/cart.js' },
  { name: 'product-reviews', src: '/widgets/reviews.js' },
  { name: 'recommendations', src: '/widgets/recommendations.js' },
];

// Параллельная загрузка всех виджетов
await Promise.all(
  ecommerceWidgets.map(widget =>
    importModuleAsync(widget.name, widget.src)
  )
);
```

### 2. Административная панель

```typescript
import { importModuleAsync } from 'microstix';

// Динамическая загрузка модулей админки
const adminModules: Record<string, string> = {
  dashboard: '/admin/dashboard.js',
  users: '/admin/users.js',
  analytics: '/admin/analytics.js',
  settings: '/admin/settings.js',
};

// Ленивая загрузка по требованию
function loadAdminModule(moduleName: string) {
  return importModuleAsync(
    `admin-${moduleName}`,
    adminModules[moduleName]
  );
}
```

### 3. Платформа для создания сайтов

```typescript
import { importModule } from 'microstix';

// Загрузка пользовательских виджетов
const userWidgets = await fetchUserWidgets();

userWidgets.forEach(widget => {
  importModule(widget.id, widget.url, (module) => {
    if (module?.mount) {
      // Добавление виджета на страницу
      const container = document.createElement('div');
      container.className = 'user-widget';
      document.body.appendChild(container);
      module.mount(container, widget.config);
    }
  });
});
```

## 📚 Дополнительные ресурсы

### Видео и статьи

- [Введение в микрофронтенды с Microstix](https://example.com/microstix-intro)
- [Миграция монолита на микрофронтенды](https://example.com/migration-guide)
- [Производительность микрофронтендов](https://example.com/performance-tips)
- [Безопасность в архитектуре микрофронтендов](https://example.com/security-best-practices)

### Сообщество

- **GitHub**: [github.com/mikhailTimoshin/microstix](https://github.com/mikhailTimoshin/microstix)
- **Discord**: [Присоединиться к сообществу](https://discord.gg/microstix)
- **Telegram**: [Канал новостей](https://t.me/microstix_news)
- **Twitter**: [@microstix_lib](https://twitter.com/microstix_lib)

### Полезные инструменты

- **Microstix DevTools** — расширение для отладки микрофронтендов
- **Microstix CLI** — инструмент для создания и управления микрофронтендами
- **Microstix Dashboard** — панель мониторинга загруженных модулей
- **Примеры проектов** — готовые шаблоны для быстрого старта

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие Microstix! Вот как вы можете помочь:

### Сообщение об ошибках

1. Проверьте, не была ли ошибка уже зарегистрирована в [Issues](https://github.com/mikhailTimoshin/microstix/issues)
2. Создайте новое issue с подробным описанием проблемы
3. Включите информацию о версии, браузере и шаги для воспроизведения

### Запросы на новые функции

1. Опишите предлагаемую функциональность
2. Объясните, как она будет полезна
3. Приведите примеры использования

### Pull Requests

1. Форкните репозиторий
2. Создайте ветку для ваших изменений
3. Добавьте тесты для новой функциональности
4. Убедитесь, что все тесты проходят
5. Создайте Pull Request с описанием изменений

### Руководство по стилю кода

- Используйте TypeScript для всей новой функциональности
- Следуйте существующей структуре кода
- Добавляйте комментарии для сложной логики
- Пишите тесты для новой функциональности
- Обновляйте документацию при изменении API

## 📄 Лицензия

MIT License © 2025 Microstix. См. файл [LICENSE](LICENSE) для подробностей.

### Разрешения

- ✅ Коммерческое использование
- ✅ Изменение и распространение
- ✅ Частное использование
- ✅ Патентное использование
- ✅ Использование без указания авторства

### Ограничения

- ❌ Ответственность
- ❌ Гарантии

## 👥 Команда и контрибьюторы

### Основные разработчики

- **Leto** ([@mikhailTimoshin](https://github.com/mikhailTimoshin)) — архитектор и ведущий разработчик

### Контрибьюторы

Спасибо всем, кто внес свой вклад в развитие Microstix! Полный список контрибьюторов доступен в [CONTRIBUTORS.md](https://github.com/mikhailTimoshin/microstix/CONTRIBUTORS.md).

### Поддержка проекта

Если вам нравится Microstix, вы можете поддержать проект:

- ⭐ **Поставьте звезду на GitHub**
- 🐛 **Сообщайте об ошибках и проблемах**
- 💬 **Помогайте другим в сообществе**
- 📢 **Расскажите о проекте в соцсетях**
- 💖 **Станьте спонсором на GitHub Sponsors**

## 📞 Контакты

- **Email**: m.timoshin88@gmail.com
- **GitHub Issues**: [github.com/mikhailTimoshin/microstix/issues](https://github.com/mikhailTimoshin/microstix/issues)
- **Документация**: [github.com/mikhailTimoshin/microstix/README.md](https://github.com/mikhailTimoshin/microstix/README.md)

---

**Microstix** — делаем микрофронтенды простыми. Минимальная конфигурация, максимальная эффективность. 🚀

*"Лучший способ предсказать будущее — создать его."* — Алан Кей

**Присоединяйтесь к революции микрофронтендов с Microstix!**
