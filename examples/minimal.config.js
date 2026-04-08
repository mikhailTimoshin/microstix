// microstix.config.js - Минимальная конфигурация для микрофронтенда
// Этот файл демонстрирует минимальную конфигурацию для микрофронтенда

export default {
  name: 'user-profile',
  entry: 'src/index.tsx',
  version: '1.0.0',

  // Общие зависимости (shared dependencies)
  sharedDeps: {
    react: {
      name: 'react',
      version: '^18.2.0',
      global: 'React',
      import: 'react',
    },
    'react-dom': {
      name: 'react-dom',
      version: '^18.2.0',
      global: 'ReactDOM',
      import: 'react-dom',
    },
  },

  // Конфигурация сборки
  build: {
    formats: ['umd', 'es'], // UMD для браузера, ES модули для современных сборок
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    fileName: '[name].[format].js',
  },

  // Что экспортирует микрофронтенд
  exports: {
    components: [
      {
        name: 'UserProfile',
        type: 'component',
        description: 'Компонент профиля пользователя',
      },
      {
        name: 'UserAvatar',
        type: 'component',
        description: 'Аватар пользователя',
      },
    ],
    services: [
      {
        name: 'UserService',
        type: 'service',
        description: 'Сервис для работы с данными пользователя',
      },
    ],
  },

  // Метаданные
  metadata: {
    type: 'microfrontend',
    framework: 'react',
    environment: 'browser',
    category: 'user-interface',
    tags: ['profile', 'user', 'ui'],
  },
};

// Альтернативный вариант с использованием функции (раскомментировать если нужно):
/*
import { createMicrofrontConfig } from 'microstix-library/config';

export default createMicrofrontConfig('user-profile', 'src/index.tsx', {
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
    components: [
      {
        name: 'UserProfile',
        type: 'component',
        description: 'Компонент профиля пользователя'
      },
      {
        name: 'UserAvatar',
        type: 'component',
        description: 'Аватар пользователя'
      }
    ],
    services: [
      {
        name: 'UserService',
        type: 'service',
        description: 'Сервис для работы с данными пользователя'
      }
    ]
  },
  metadata: {
    type: 'microfrontend',
    framework: 'react',
    environment: 'browser',
    category: 'user-interface',
    tags: ['profile', 'user', 'ui']
  }
});
*/
