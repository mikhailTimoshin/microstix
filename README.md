# Microstix

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Microstix** — минималистичная TypeScript библиотека для управления микрофронтендами. Простая, легковесная и эффективная система для загрузки и регистрации микрофронтендов в веб-приложениях.

## 🎯 Особенности

- **Минималистичный API** — всего 4 основные функции
- **Нулевые зависимости** — работает без внешних библиотек
- **TypeScript first** — полная типобезопасность из коробки
- **Автоматическая дедупликация** — скрипты загружаются только один раз
- **Поддержка Web Components** — встроенный компонент для загрузки микрофронтендов
- **Глобальный реестр** — централизованное управление микрофронтендами

## 📦 Установка

```bash
npm install microstix
```

Или прямая загрузка через CDN:

```html
<script src="https://unpkg.com/microstix"></script>
```

## 🚀 Быстрый старт

### 1. В хостовом приложении

```javascript
import Microstix from 'microstix';

// Загрузка микрофронтенда
Microstix.importModule('my-widget', '/static/my-widget/bundle.js', (widgetData) => {
  console.log('Микрофронтенд загружен:', widgetData);
});
```

### 2. В микрофронтенде (remote)

```javascript
import Microstix from 'microstix';

// Регистрация микрофронтенда
Microstix.exportModule('my-widget', {
  name: 'my-widget',
  version: '1.0.0',
  type: 'react',
  mount: (container, context) => {
    // Логика монтирования приложения
    console.log('Монтируем приложение в:', container);
  }
});
```

### 3. Использование Web Component

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
```javascript
import Microstix from 'microstix';

Microstix.importModule('dashboard', '/static/dashboard.js', (data) => {
  if (data) {
    console.log(`Версия: ${data.version}`);
    console.log(`Тип: ${data.type}`);
    
    // Если микрофронтенд предоставляет функцию mount
    if (data.mount) {
      data.mount(document.getElementById('dashboard-container'));
    }
  }
});
```

#### `Microstix.exportModule(name: string, props: RegistryProps): void`

Регистрирует микрофронтенд в глобальном реестре.

**Параметры:**
- `name` — уникальное имя микрофронтенда
- `props` — свойства микрофронтенда

**Пример:**
```javascript
import Microstix from 'microstix';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

Microstix.exportModule('header', {
  name: 'header',
  version: '2.1.0',
  type: 'react',
  framework: 'nextjs',
  author: 'Команда фронтенда',
  mount: (container, context) => {
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(App, context));
    
    // Возвращаем функцию очистки
    return () => root.unmount();
  }
});
```

#### `Microstix.registerSharedLib(name: string, lib: unknown, global?: boolean): void`

Регистрирует общую библиотеку для использования микрофронтендами.

**Параметры:**
- `name` — имя библиотеки
- `lib` — объект библиотеки
- `global` — если true, библиотека будет доступна через window[name]

**Пример:**
```javascript
import Microstix from 'microstix';
import React from 'react';

// Регистрация React как общей библиотеки
Microstix.registerSharedLib('react', React, true);
```

#### `Microstix.useSharedLib(name: string): unknown`

Получает зарегистрированную общую библиотеку.

**Параметры:**
- `name` — имя библиотеки

**Пример:**
```javascript
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
```javascript
import Microstix from 'microstix';

async function loadWidget() {
  try {
    const widgetData = await Microstix.importModuleAsync(
      'dashboard',
      '/static/dashboard.js'
    );
    
    if (widgetData && widgetData.mount) {
      widgetData.mount(document.getElementById('dashboard-container'));
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
```javascript
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

### TypeScript типы

Библиотека включает полную типизацию TypeScript:

```typescript
// Базовые свойства микрофронтенда
export type RegistryBaseProps = {
  name: string;
  version: string;
  mount?: (target: HTMLElement, context?: Record<string, unknown>) => void;
};

// Полные свойства микрофронтенда
export type RegistryProps = RegistryBaseProps & Record<string, unknown>;

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

### Преимущества подхода

- **Автоматическая дедупликация** — скрипты загружаются только один раз
- **Простая интеграция** — не требует сложной конфигурации
- **Гибкость** — работает с любыми фреймворками
- **Легковесность** — размер библиотеки ~3KB (несжатый)

## 📁 Структура проекта

### Хостовое приложение
```javascript
// host/src/main.js
import Microstix from 'microstix';

// Загрузка нескольких микрофронтендов
const loadMicrofrontends = async () => {
  await Promise.all([
    loadModule('header', '/static/header.js'),
    loadModule('dashboard', '/static/dashboard.js'),
    loadModule('sidebar', '/static/sidebar.js')
  ]);
};

function loadModule(name, src) {
  return new Promise((resolve) => {
    Microstix.importModule(name, src, (data) => {
      console.log(`${name} загружен`);
      resolve(data);
    });
  });
}
```

### Микрофронтенд (remote)
```javascript
// remote/src/index.js
import Microstix from 'microstix';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Регистрация в Microstix
Microstix.exportModule('my-widget', {
  name: 'my-widget',
  version: '1.0.0',
  type: 'react',
  mount: (container, context = {}) => {
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(App, context));
    
    return () => root.unmount();
  }
});

// UMD экспорт для прямой загрузки
if (typeof window !== 'undefined') {
  window.MyWidget = {
    init: (containerId, props) => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Контейнер ${containerId} не найден`);
        return () => {};
      }
      
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(App, props));
      
      return () => {
        root.unmount();
        container.innerHTML = '';
      };
    }
  };
}
```

## 🔧 Интеграция с Vite

### Конфигурация микрофронтенда (remote)
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'MyWidget',
      formats: ['umd'],
      fileName: 'bundle'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

### Конфигурация хоста (host)
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/static': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

## 🎯 Примеры использования

### Пример 1: Базовая загрузка с обработкой ошибок
```javascript
import Microstix from 'microstix';

function loadModule(name, src, maxRetries = 3) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const tryLoad = () => {
      attempts++;
      
      Microstix.importModule(name, src, (data) => {
        if (data) {
          resolve(data);
        } else if (attempts < maxRetries) {
          console.log(`Повторная попытка ${attempts + 1}/${maxRetries}`);
          setTimeout(tryLoad, 1000);
        } else {
          reject(new Error(`Не удалось загрузить ${name}`));
        }
      });
    };
    
    tryLoad();
  });
}

// Использование
loadModule('user-profile', '/static/profile.js')
  .then(data => console.log('Загружено:', data))
  .catch(error => console.error('Ошибка:', error));
```

### Пример 2: Управление общими библиотеками
```javascript
import Microstix from 'microstix';
import React from 'react';
import ReactDOM from 'react-dom';

// В хостовом приложении регистрируем общие библиотеки
Microstix.registerSharedLib('react', React, true);
Microstix.registerSharedLib('react-dom', ReactDOM, true);

// В микрофронтенде используем общие библиотеки
const sharedReact = Microstix.useSharedLib('react');
const sharedReactDOM = Microstix.useSharedLib('react-dom');

if (sharedReact && sharedReactDOM) {
  // Используем общие библиотеки вместо установки своих копий
}
```

### Пример 3: Динамическая загрузка по требованию
```javascript
import Microstix from 'microstix';

// Кэш загруженных модулей
const moduleCache = new Map();

async function loadOnDemand(name, src) {
  if (moduleCache.has(name)) {
    return moduleCache.get(name);
  }
  
  return new Promise((resolve) => {
    Microstix.importModule(name, src, (data) => {
      if (data) {
        moduleCache.set(name, data);
      }
      resolve(data);
    });
  });
}

// Загрузка только при клике
document.getElementById('chat-button').addEventListener('click', async () => {
  const chatModule = await loadOnDemand('chat', '/static/chat.js');
  if (chatModule && chatModule.mount) {
    chatModule.mount(document.getElementById('chat-container'));
  }
});
```

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
- React
- Vue
- Angular
- Svelte
- Любые другие фреймворки или ванильный JavaScript

### Сборщики
- Vite
- Webpack
- Rollup
- Parcel
- ESBuild

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

### Сообщение об ошибках
При возникновении проблем:
1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что скрипты доступны по указанным URL
3. Проверьте CORS политики для кросс-доменных ресурсов
4. Убедитесь, что микрофронтенд вызывает `exportModule()` при загрузке

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
│   └── index.types.ts    # TypeScript типы
├── dist/                 # Собранные файлы
├── examples/             # Примеры использования
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
                type: 'test'
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
- **Версия**: 1.4.0

---

**Microstix** — делаем микрофронтенды простыми. Минимальная конфигурация, максимальная эффективность. 🚀

**Новые возможности в версии 1.4.0:**
- Добавлена функция `importModuleAsync` для асинхронной загрузки
- Добавлена функция `createStore` для управления состоянием
- Улучшена TypeScript типизация
- Оптимизирована производительность