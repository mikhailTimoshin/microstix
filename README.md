# Microstix

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Microstix** — это минималистичная TypeScript библиотека для управления микрофронтендами. Простая, легковесная и эффективная система для загрузки и регистрации микрофронтендов в корпоративных порталах.

## 🎯 Особенности

- **Минималистичный дизайн** — всего 2 основные функции
- **Нулевые зависимости** — работает без внешних библиотек
- **TypeScript first** — полная типобезопасность из коробки
- **UMD/ESM поддержка** — работает с любыми форматами модулей
- **Автоматическая регистрация** — микрофронтенды регистрируются автоматически
- **Предотвращение дублирования** — скрипты загружаются только один раз

## 📦 Установка

```bash
# Установка как зависимости
npm install microstix

# Или прямая загрузка через CDN
<script src="https://unpkg.com/microstix"></script>
```

## 🚀 Быстрый старт

### 1. В хостовом приложении

```javascript
// Импортируем библиотеку
import Mic from 'microstix';

// Загружаем микрофронтенд
Mic.importModule('my-widget', '/static/my-widget/bundle.js', (widgetData) => {
  console.log('Микрофронтенд загружен:', widgetData);
});
```

### 2. В микрофронтенде (remote)

```javascript
// В точке входа микрофронтенда
import Mic from 'microstix';
import App from '@/components/App.tsx'

// Регистрируем микрофронтенд
Mic.exportModule('my-widget', {
  name: 'my-widget',
  version: '1.0.0',
  type: 'react',
  App
});

```

## 📖 API Reference

### `Microstix.importModule(name: string, src: string, callback: (data: RegistryProps | undefined) => void): void`

Загружает микрофронтенд и вызывает callback с данными после загрузки.

**Параметры:**
- `name` — уникальное имя микрофронтенда
- `src` — URL скрипта микрофронтенда
- `callback` — функция, вызываемая после загрузки

**Пример:**
```javascript
import Mic from 'microstix';

Mic.importModule('dashboard', '/static/dashboard.js', (data) => {
  if (data) {
    console.log(`Версия: ${data.version}`);
    console.log(`Тип: ${data.type}`);
  }
});
```

### `Microstix.exportModule(name: string, props: RegistryProps): void`

Регистрирует микрофронтенд в реестре.

**Параметры:**
- `name` — уникальное имя микрофронтенда
- `props` — свойства микрофронтенда

**Пример:**
```javascript
import Mic from 'microstix';

Mic.exportModule('header', {
  name: 'header',
  version: '2.1.0',
  type: 'react',
  framework: 'nextjs',
  author: 'Команда фронтенда'
});
```

### Типы

```typescript
type RegistryProps = {
  name: string;
  version: string;
} & Record<string, unknown>;

type RegistryExporter = {
  importModule: (name: string, src: string, resolve: (data: RegistryProps | undefined) => void) => void;
  exportModule: (name: string, props: RegistryProps) => void;
};
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
- **Легковесность** — размер библиотеки < 2KB

## 📁 Структура проекта

### Хостовое приложение
```javascript
// host/src/main.js
import Mic from 'microstix';

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
    Mic.importModule(name, src, (data) => {
      console.log(`${name} загружен`);
      resolve(data);
    });
  });
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

### Пример 1: Базовая загрузка
```javascript
import Mic from 'microstix';

// Загрузка одного микрофронтенда
Mic.importModule('user-profile', '/static/profile.js', (profile) => {
  if (profile) {
    profile.init('profile-container', {
      userId: 123,
      theme: 'dark'
    });
  }
});
```

### Пример 2: Параллельная загрузка
```javascript
import Mic from 'microstix';

// Параллельная загрузка нескольких микрофронтендов
const microfrontends = [
  { name: 'header', src: '/static/header.js' },
  { name: 'sidebar', src: '/static/sidebar.js' },
  { name: 'content', src: '/static/content.js' }
];

const loadAll = async () => {
  const promises = microfrontends.map(({ name, src }) => {
    return new Promise((resolve) => {
      Mic.importModule(name, src, resolve);
    });
  });
  
  const results = await Promise.all(promises);
  console.log('Все микрофронтенды загружены:', results);
};
```

### Пример 3: Обработка ошибок
```javascript
import Mic from 'microstix';

// Загрузка с обработкой ошибок
function loadWithRetry(name, src, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (attemptNumber) => {
      Mic.importModule(name, src, (data) => {
        if (data) {
          resolve(data);
        } else if (attemptNumber < retries) {
          console.log(`Повторная попытка ${attemptNumber + 1}/${retries}`);
          setTimeout(() => attempt(attemptNumber + 1), 1000);
        } else {
          reject(new Error(`Не удалось загрузить ${name}`));
        }
      });
    };
    
    attempt(1);
  });
}
```
## 📊 Производительность

- **Размер библиотеки**: < 2KB (gzipped)
- **Время загрузки**: < 1ms
- **Потребление памяти**: минимальное
- **Скорость регистрации**: O(1)

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
- Любые фреймворки или библиотеки

### Сборщики
- Vite
- Webpack
- Rollup
- Parcel
- ESBuild

## 🚀 Продвинутые сценарии

### Динамическая загрузка по требованию
```javascript
import Mic from 'microstix';

// Функция для загрузки одного модуля
function loadModule(name, src) {
  return new Promise((resolve) => {
    Mic.importModule(name, src, (data) => {
      resolve({ name, data });
    });
  });
}

// Lazy loading микрофронтендов
const lazyModules = {
  analytics: () => loadModule('analytics', '/static/analytics.js'),
  chat: () => loadModule('chat', '/static/chat.js'),
  admin: () => loadModule('admin', '/static/admin.js')
};

// Загрузка только при необходимости
document.getElementById('chat-button').addEventListener('click', async () => {
  const chat = await lazyModules.chat();
  if (chat) chat.init('chat-container');
});
```

### Управление версиями
```javascript
import Mic from 'microstix';

// Загрузка конкретной версии
function loadVersionedModule(name, version) {
  const src = `/static/${name}/v${version}/bundle.js`;
  return new Promise((resolve) => {
    Mic.importModule(`${name}-v${version}`, src, resolve);
  });
}

// Использование
const headerV1 = await loadVersionedModule('header', '1.0.0');
const headerV2 = await loadVersionedModule('header', '2.0.0');
```

## 📞 Поддержка

### Часто задаваемые вопросы

**Q: Нужно ли добавлять Microstix в каждый микрофронтенд?**
A: Да, каждый микрофронтенд должен импортировать библиотеку для регистрации.

**Q: Можно ли использовать без сборщика?**
A: Да, библиотека работает с обычными JavaScript файлами и не требует отдельной настройки.

**Q: Поддерживает ли TypeScript?**
A: Да, библиотека написана на TypeScript и включает типы.

### Сообщение об ошибках
При возникновении проблем:
1. Проверьте консоль браузера
2. Убедитесь, что скрипты доступны по URL
3. Проверьте CORS политики
4. Включите режим отладки

## 📄 Лицензия

MIT License © 2024 Microstix. network.ru.net team!

## 👥 Команда

- **Архитектор**: Leto

---

**Microstix** — делаем микрофронтенды простыми. Минимальная конфигурация, максимальная эффективность. 🚀