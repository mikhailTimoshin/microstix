/**
 * Простой пример использования библиотеки Microstix
 *
 * Этот пример показывает базовое использование библиотеки для загрузки
 * и регистрации микрофронтендов.
 */

// В реальном приложении вы бы импортировали библиотеку так:
// import Microstix from 'microstix-library';
// или через CDN:
// <script src="https://unpkg.com/microstix-library"></script>

// Для примера симулируем работу библиотеки
const Microstix = {
  importModule: (name, src, callback) => {
    console.log(`📥 Загрузка микрофронтенда: ${name}`);
    console.log(`   URL: ${src}`);

    // Симуляция загрузки скрипта
    setTimeout(() => {
      // После загрузки вызываем callback с данными
      const mockData = {
        name: name,
        version: '1.0.0',
        type: 'react',
        loadedAt: new Date().toISOString()
      };
      console.log(`✅ ${name} загружен`);
      callback(mockData);
    }, 100);
  },

  exportModule: (name, props) => {
    console.log(`📦 Регистрация микрофронтенда: ${name}`);
    console.log('   Свойства:', props);
  }
};

console.log('🚀 Пример использования Microstix\n');

// Пример 1: Загрузка микрофронтенда (хостовое приложение)
console.log('1. Загрузка микрофронтенда из хостового приложения:');
Microstix.importModule('user-widget', '/static/user-widget.js', (widgetData) => {
  if (widgetData) {
    console.log(`   📊 Данные виджета:`);
    console.log(`      Имя: ${widgetData.name}`);
    console.log(`      Версия: ${widgetData.version}`);
    console.log(`      Тип: ${widgetData.type}`);

    // После загрузки можно инициализировать виджет
    if (window.UserWidget && window.UserWidget.init) {
      console.log('   🎯 Инициализация виджета...');
      // window.UserWidget.init('user-container', { userId: 123 });
    }
  }
});

console.log('\n2. Регистрация микрофронтенда (точка входа микрофронтенда):');
// Этот код выполняется внутри микрофронтенда
Microstix.exportModule('user-widget', {
  name: 'user-widget',
  version: '1.0.0',
  type: 'react',
  framework: 'react-18',
  author: 'Команда фронтенда',
  exports: ['UserProfile', 'UserSettings'],
  dependencies: ['react', 'react-dom']
});

console.log('\n3. Параллельная загрузка нескольких микрофронтендов:');
const microfrontends = [
  { name: 'header', src: '/static/header.js' },
  { name: 'sidebar', src: '/static/sidebar.js' },
  { name: 'dashboard', src: '/static/dashboard.js' }
];

// Функция для загрузки одного модуля
function loadModule(name, src) {
  return new Promise((resolve) => {
    Microstix.importModule(name, src, (data) => {
      resolve({ name, data });
    });
  });
}

// Параллельная загрузка
Promise.all(
  microfrontends.map(mf => loadModule(mf.name, mf.src))
).then(results => {
  console.log(`   ✅ Загружено ${results.length} микрофронтендов:`);
  results.forEach(result => {
    console.log(`      • ${result.name}: ${result.data ? 'успешно' : 'ошибка'}`);
  });
});

console.log('\n4. Пример с обработкой ошибок:');
function loadWithRetry(name, src, maxRetries = 3) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryLoad = () => {
      attempts++;
      console.log(`   Попытка ${attempts}/${maxRetries} загрузить ${name}`);

      Microstix.importModule(name, src, (data) => {
        if (data) {
          resolve(data);
        } else if (attempts < maxRetries) {
          setTimeout(tryLoad, 1000); // Повтор через 1 секунду
        } else {
          reject(new Error(`Не удалось загрузить ${name} после ${maxRetries} попыток`));
        }
      });
    };

    tryLoad();
  });
}

// Пример использования retry
loadWithRetry('analytics', '/static/analytics.js', 2)
  .then(data => console.log(`   ✅ Analytics загружен: ${data.version}`))
  .catch(error => console.log(`   ❌ Ошибка: ${error.message}`));

console.log('\n5. Использование в реальном React компоненте:');
const reactExample = `
// HostApp.jsx - хостовое приложение
import React, { useEffect } from 'react';
import Microstix from 'microstix-library';

function HostApp() {
  useEffect(() => {
    // Загрузка микрофронтенда при монтировании компонента
    Microstix.importModule('user-profile', '/static/profile.js', (data) => {
      if (data && window.UserProfile) {
        window.UserProfile.init('profile-container', {
          userId: '123',
          theme: 'dark'
        });
      }
    });

    // Очистка при размонтировании
    return () => {
      if (window.UserProfile && window.UserProfile.destroy) {
        window.UserProfile.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h1>Мое приложение</h1>
      <div id="profile-container" />
    </div>
  );
}
`;

console.log(reactExample);

console.log('\n6. Пример микрофронтенда (точка входа):');
const microfrontendExample = `
// user-widget/index.js - точка входа микрофронтенда
import Microstix from 'microstix-library';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Регистрация в Microstix
Microstix.exportModule('user-widget', {
  name: 'user-widget',
  version: '1.0.0',
  type: 'react',
  exports: ['UserWidget']
});

// UMD экспорт для прямой загрузки
window.UserWidget = {
  init: (containerId, props) => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(\`Контейнер \${containerId} не найден\`);
      return () => {};
    }

    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(App, props));

    // Возвращаем функцию для очистки
    return () => {
      root.unmount();
      container.innerHTML = '';
    };
  },

  destroy: () => {
    // Дополнительная логика очистки
    console.log('UserWidget уничтожен');
  }
};
`;

console.log(microfrontendExample);

console.log('\n🎯 Ключевые преимущества Microstix:');
console.log('   • Минимальный API - всего 2 функции');
console.log('   • Автоматическая дедупликация скриптов');
console.log('   • Поддержка любых фреймворков');
console.log('   • Полная TypeScript поддержка');
console.log('   • Размер < 2KB');

console.log('\n📋 Краткое руководство:');
console.log('   1. Установите библиотеку: npm install microstix-library');
console.log('   2. В хосте: используйте Microstix.importModule() для загрузки');
console.log('   3. В микрофронтенде: используйте Microstix.exportModule() для регистрации');
console.log('   4. Экспортируйте UMD бандл через window.[name]');
console.log('   5. Инициализируйте через window.[name].init()');

console.log('\n✅ Пример завершен!');
