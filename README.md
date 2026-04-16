# Microstix

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.15.0-blue.svg)](https://www.npmjs.com/package/microstix)
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

// Загрузка микрофронтенда
Microstix.importModule('my-widget', '/static/my-widget/bundle.js', (widgetData) => {
  console.log('Микрофронтенд загружен:', widgetData);
});
```

### 2. В микрофронтенде (remote-app)

```typescript
import Microstix from 'microstix';
import App from './components/App';

// Регистрация микрофронтенда
Microstix.exportModule('my-widget', {
  name: 'my-widget',
  version: '1.0.0',
  App, // Экспорт React компонента
});
```

### 3. Использование React компонента в хосте

```tsx
import { useState, useEffect } from 'react';
import Microstix from 'microstix';

function MicroComponent({ cfg }) {
  const [loaded, setLoaded] = useState(false);
  const Component = Microstix.useSharedLib(cfg.name)?.[cfg.obj];

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

  return loaded && <Component {...props} />;
}
```

### 4. Использование Web Component

```html
<app-component 
  name="my-widget" 
  src="/static/my-widget/bundle.js"
  styles="/static/my-widget/styles.css">
</app-component>
```

## 📖 API Reference

### Основные функции

#### `Microstix.importModule(name: string, src: string, callback: (data: RegistryProps | undefined) => void): void`

Загружает микрофронтенд и вызывает callback с данными после загрузки.

**Параметры:**
- `name` — уникальное имя микрофронтенда
- `src` — URL скрипта микрофронтенда
- `callback` — функция, вызываемая после загрузки

**Пример:**
```typescript
import Microstix from 'microstix';

Microstix.importModule('dashboard', '/static/dashboard.js', (data) => {
  if (data) {
    console.log(`Версия: ${data.version}`);
    
    // Если микрофронтенд предоставляет компонент App
    if (data.App) {
      // Используйте data.App как React компонент
    }
  }
});
```

#### `Microstix.exportModule(name: string, props: RegistryProps): void`

Регистрирует микрофронтенд в глобальном реестре.

**Параметры:**
- `name` — уникальное имя микрофронтенда
- `props` — свойства микрофронтенда (должен содержать компонент App)

**Пример:**
```typescript
import Microstix from 'microstix';
import App from './components/App';

Microstix.exportModule('header', {
  name: 'header',
  version: '2.1.0',
  App, // React компонент для рендеринга
});
```

#### `Microstix.registerSharedLib(name: string, lib: unknown, global?: boolean): void`

Регистрирует общую библиотеку для использования микрофронтендами.

**Параметры:**
- `name` — имя библиотеки
- `lib` — объект библиотеки
- `global` — если true, библиотека будет доступна через window[name]

**Пример:**
```typescript
import Microstix from 'microstix';
import React from 'react';

// Регистрация React как общей библиотеки
Microstix.registerSharedLib('react', React, true);
```

#### `Microstix.useSharedLib<T = unknown>(name: string): T | undefined`

Получает зарегистрированную общую библиотеку.

**Параметры:**
- `name` — имя библиотеки

**Пример:**
```typescript
import Microstix from 'microstix';

const React = Microstix.useSharedLib('react');
if (React) {
  // Используем React из общей библиотеки
}
```

#### `Microstix.importModuleAsync(name: string, src: string): Promise<RegistryProps | undefined>`

Асинхронная версия `importModule`, возвращает Promise.

**Параметры:**
- `name` — уникальное имя микрофронтенда
- `src` — URL скрипта микрофронтенда

**Возвращает:** Promise с данными микрофронтенда или undefined

**Пример:**
```typescript
import Microstix from 'microstix';

async function loadWidget() {
  try {
    const widgetData = await Microstix.importModuleAsync(
      'dashboard',
      '/static/dashboard.js'
    );
    
    if (widgetData && widgetData.App) {
      // Используйте widgetData.App как компонент
    }
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
}
```

#### `Microstix.createStore<T extends Record<string, any>>(initial: T): T & {subscribe: (fn: (state: T) => void) => () => boolean}`

Создает реактивное хранилище состояния с подпиской на изменения.

**Параметры:**
- `initial` — начальное состояние хранилища

**Возвращает:** Proxy объект с подпиской на изменения

**Пример:**
```typescript
import Microstix from 'microstix';

// Создание хранилища
const store = Microstix.createStore({
  count: 0,
  user: null
});

// Подписка на изменения
const unsubscribe = store.subscribe((state) => {
  console.log('Состояние обновлено:', state);
});

// Изменение состояния
store.count = 1;
store.user = { name: 'John' };

// Отписка
unsubscribe();
```

#### `Microstix.registerStylesheet({name, rel, obj}: RegisterStylesheetProps): void`

Регистрирует и загружает CSS стили для микрофронтенда.

**Параметры:**
- `name` — имя стилей
- `rel` — URL CSS файла
- `obj` — объект стилей

**Пример:**
```typescript
import Microstix from 'microstix';

Microstix.registerStylesheet({
  name: 'widget-styles',
  rel: '/static/widget.css',
  obj: 'widget'
});
```

### TypeScript типы

Библиотека включает полную типизацию TypeScript:

```typescript
// Базовые свойства микрофронтенда
export type RegistryBaseProps = {
  name: string;
  version: string;
  mount?: (target: HTMLElement, context?: Record<string, unknown>) => (() => void) | undefined;
};

// Полные свойства микрофронтенда
export type RegistryProps = RegistryBaseProps & Record<string, unknown>;

// Параметры для регистрации стилей
export type RegisterStylesheetProps = {
  name: string;
  rel: string;
  obj: string;
};

// API библиотеки
export type RegistryExporter = {
  importModule: (
    name: string,
    src: string,
    resolve: (data: RegistryProps | undefined) => void
  ) => void;
  importModuleAsync: (name: string, src: string) => Promise<RegistryProps | undefined>;
  exportModule: (name: string, props: RegistryProps) => void;
  registerSharedLib: (name: string, lib: unknown, global?: boolean) => void;
  useSharedLib: <T = unknown>(name: string) => T | undefined;
  registerStylesheet: (cfg: RegisterStylesheetProps) => void;
  createStore: <T extends Record<string, any>>(initial: T) => T & {subscribe: (fn: (state: T) => void) => () => boolean};
};

// Глобальное объявление для использования в браузере
declare global {
  interface Window {
    Microstix?: RegistryExporter;
    [name: string]: unknown;
  }
}
```

### Web Component: `<app-component>`

Библиотека предоставляет кастомный элемент `<app-component>` для декларативной загрузки микрофронтендов.

**Атрибуты:**
- `name` — имя микрофронтенда (обязательный)
- `src` — URL скрипта микрофронтенда (обязательный)
- `styles` — URL CSS стилей (опциональный)

**Пример:**
```html
<app-component 
  name="user-profile"
  src="/static/profile.js"
  styles="/static/profile.css">
</app-component>
```

## 🏗️ Архитектура

### Как это работает

1. **Хостовое приложение** вызывает `importModule()` для загрузки микрофронтенда
2. **Библиотека** создает `<script>` тег и загружает скрипт
3. **Микрофронтенд** при загрузке вызывает `exportModule()` для регистрации
4. **Библиотека** сохраняет метаданные в реестр
5. **Callback** вызывается с данными микрофронтенда
6. **React компонент** из данных используется для рендеринга

### Преимущества подхода

- **Автоматическая дедупликация** — скрипты загружаются только один раз
- **Простая интеграция** — не требует сложной конфигурации
- **Гибкость** — работает с любыми фреймворками
- **Легковесность** — размер библиотеки ~4KB (несжатый)
- **TypeScript поддержка** — полная типизация из коробки

## 📁 Структура проекта

### Пример хостового приложения (host-app)

**package.json:**
```json
{
  "name": "microstix-host-app",
  "dependencies": {
    "microstix": "^1.14.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "microstix"],
  },
});
```

**Компонент для загрузки микрофронтендов:**
```tsx
import type { PropsWithChildren, FC } from "react";
import { useState, useEffect } from "react";
import Microstix from "microstix";

export type MicroComponent = {
  cfg: {
    name: string,
    src: string,
    rel: string,
    obj: string,
  },
  [T: string]: unknown,
};

function Component(props: PropsWithChildren<MicroComponent>) {
  const Cmp = Microstix.useSharedLib<Record<string, unknown>>(props.cfg.name)?.[props.cfg.obj] as FC<PropsWithChildren>;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Microstix.importModule(
      props.cfg.name,
      props.cfg.src,
      (result) => {
        Microstix.registerStylesheet(props.cfg);
        Microstix.registerSharedLib(props.cfg.name, result);
        setLoaded(true);
      },
    );
  }, [props.cfg]);

  return loaded && <Cmp {...props} />;
}

export default Component;
```

### Пример микрофронтенда (remote-app)

**package.json:**
```json
{
  "name": "remote-app",
  "dependencies": {
    "microstix": "^1.14.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import { microstixVitePlugin, getReactProd } from 'microstix/vite-plugin';
import react from '@vitejs/plugin-react';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [ 
    react(getReactProd(!isDev)), 
    microstixVitePlugin({
      name: 'inputWidget',
      component: 'src/index.tsx',
      sharedLibs: {
        'react': "React",
        "react-dom": "ReactDOM",
        'react/jsx-runtime': 'react/jsx-runtime',
      },
    })
  ]
});
```

**Точка входа (index.tsx):**
```typescript
import App from "./components/App/App.tsx";
import Microstix from "microstix";

Microstix.exportModule("inputWidget", {
  name: "inputWidget",
  version: "1.0.0",
  App, // Экспорт React компонента
});
```

**React компонент (App.tsx):**
```tsx
import './App.css';
import type { PropsWithChildren, JSX } from "react";

export type AppProps = {
  title: string;
  message: string;
};

function App({ title, message, children }: PropsWithChildren<AppProps>): JSX.Element {
  return (
    <div className={'widget-container'}>
      <header className="widget-header">
        <h1 className="widget-title">{title}</h1>
      </header>
      <main className="widget-content">
        <p className="widget-message">{message}</p>
        {children}
      </main>
    </div>
  );
}

export default App;
```

## 🔧 Интеграция с Vite

### Плагин Vite для Microstix

Microstix предоставляет официальный плагин для Vite, который упрощает конфигурацию сборки микрофронтендов.

#### Установка

```bash
npm install microstix
```

#### Базовое использование

```typescript
import { defineConfig } from 'vite';
import { microstixVitePlugin, getReactProd } from 'microstix/vite-plugin';
import react from '@vitejs/plugin-react';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [ 
    react(getReactProd(!isDev)), 
    microstixVitePlugin({
      name: 'my-widget',
      component: 'src/index.tsx',
      sharedLibs: {
        'react': "React",
        "react-dom": "ReactDOM",
        'react/jsx-runtime': 'react/jsx-runtime',
      },
    })
  ]
});
```

### Преимущества плагина

1. **Автоматическая конфигурация** — минимум ручной настройки
2. **TypeScript поддержка** — полная типизация из коробки
3. **JSX Runtime оптимизация** — автоматическое переключение на production JSX
4. **Гибкость** — возможность кастомизации всех параметров
5. **Интеграция** — seamless интеграция с экосистемой Vite

## 📊 Производительность

- **Размер библиотеки**: ~4KB (несжатый), ~2KB (gzipped)
- **Время загрузки**: < 1ms
- **Потребление памяти**: минимальное
- **Скорость регистрации**: O(1)
- **Поддержка реактивности**: встроенное хранилище состояния

## 🔒 Безопасность

- **Изоляция**: Каждый микрофронтенд работает независимо
- **Валидация**: Базовые проверки входных данных
- **Безопасные URL**: Проверка источников скриптов
- **CORS поддержка**: Работает с кросс-доменными ресурсами

## 🤝 Совместимость

### Браузеры
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Фреймворки
- React (полная поддержка)
- Vue (через кастомную интеграцию)
- Angular (через кастомную интеграцию)
- Svelte (через кастомную интеграцию)
- Любые другие фреймворки или ванильный JavaScript

### Сборщики
- Vite (с официальным плагином)
- Webpack (через ручную конфигурацию)
- Rollup (через ручную конфигурацию)
- Parcel (через ручную конфигурацию)
- ESBuild (через ручную конфигурацию)

## 📞 Поддержка

### Часто задаваемые вопросы

**Q: Нужно ли добавлять Microstix в каждый микрофронтенд?**
A: Да, каждый микрофронтенд должен импортировать библиотеку для регистрации через `exportModule()`.

**Q: Можно ли использовать без сборщика?**
A: Да, библиотека работает с обычными JavaScript файлами через CDN.

**Q: Поддерживает ли TypeScript?**
A: Да, библиотека написана на TypeScript и включает типы из коробки.

**Q: Как обрабатывать ошибки загрузки?**
A: Используйте Promise-обертки и retry логику как показано в примерах.

**Q: Можно ли использовать React без установки в микрофронтенде?**
A: Да, через систему общих библиотек (`registerSharedLib`/`useSharedLib`).

**Q: Как работает JSX Runtime в production?**
A: Плагин Vite автоматически переключает JSX импорты на оптимизированную версию.

### Сообщение об ошибках
При возникновении проблем:
1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что скрипты доступны по указанным URL
3. Проверьте CORS политики для кросс-доменных ресурсов
4. Убедитесь, что микрофронтенд вызывает `exportModule()` при загрузке
5. Проверьте, что React компонент корректно экспортируется

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
│   ├── index.ts          # Основной код библиотеки
│   ├── index.types.ts    # TypeScript типы
│   ├── vite-plugin.ts    # Плагин для Vite
│   └── jsx-runtime.ts    # JSX Runtime поддержка
├── dist/                 # Собранные файлы
├── package.json          # Конфигурация npm
├── tsconfig.json         # Конфигурация TypeScript
├── tsup.config.js        # Конфигурация сборки
└── README.md            # Документация
```

### Тестирование
Для тестирования библиотеки создайте HTML файл с примером использования:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Microstix Test</title>
    <script src="./dist/index.js"></script>
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
            window.Microstix.exportModule('test-module', {
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

## 📄 Лицензия

MIT License © 2026 Microstix. См. файл [LICENSE](LICENSE) для подробностей.

## 👥 Команда

- **Архитектор**: Leto
- **Версия**: 1.15.0

---

**Microstix** — делаем микрофронтенды простыми. Минимальная конфигурация, максимальная эффективность. 🚀

**Новые возможности в версии 1.15.0:**
- Добавлены функция `registerStylesheet`
- Улучшен Vite плагин с поддержкой JSX Runtime
- Добавлена полная TypeScript типизация
- Оптимизирована производительность загрузки скриптов
- Добавлены примеры интеграции с React
- Улучшена документация и примеры использования


