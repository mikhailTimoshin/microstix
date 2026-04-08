/**
 * Минимальный пример использования библиотеки Microstix
 *
 * Этот пример показывает базовое использование реестра и загрузчика микрофронтендов.
 */

// Импортируем функции из библиотеки
const {
  // Реестр
  addComponent,
  getComponent,
  addService,
  getService,
  addSharedDependency,
  getSharedDependency,
  clearRegistry,

  // Загрузчик
  importMicrofront,

  // События
  registryEvents,
  createDebugLogger
} = require('../dist/index.js');

console.log('🚀 Минимальный пример использования Microstix\n');

// 1. Настройка отладки событий (опционально)
console.log('1. Настройка отладки событий:');
const unsubscribeDebug = createDebugLogger('[Microstix]');

// 2. Добавление зависимостей в реестр
console.log('\n2. Добавление зависимостей в реестр:');

addSharedDependency({
  name: 'react',
  version: '^18.2.0',
  global: 'React',
  import: 'react'
});

addSharedDependency({
  name: 'react-dom',
  version: '^18.2.0',
  global: 'ReactDOM',
  import: 'react-dom'
});

console.log('   ✅ Добавлены зависимости React и ReactDOM');

// 3. Добавление компонентов в реестр
console.log('\n3. Добавление компонентов в реестр:');

addComponent({
  name: 'Header',
  type: 'react',
  version: '1.0.0',
  exports: ['Header', 'HeaderLogo'],
  dependencies: ['react', 'react-dom']
});

addComponent({
  name: 'Dashboard',
  type: 'react',
  version: '1.0.0',
  exports: ['Dashboard', 'DashboardWidget'],
  dependencies: ['react']
});

console.log('   ✅ Добавлены компоненты Header и Dashboard');

// 4. Добавление сервисов в реестр
console.log('\n4. Добавление сервисов в реестр:');

addService({
  name: 'AuthService',
  type: 'authentication',
  version: '1.0.0',
  methods: ['login', 'logout', 'getUser'],
  dependencies: []
});

console.log('   ✅ Добавлен сервис AuthService');

// 5. Получение данных из реестра
console.log('\n5. Получение данных из реестра:');

const reactDep = getSharedDependency('react');
const headerComponent = getComponent('Header');
const authService = getService('AuthService');

console.log('   📚 Зависимость React:', reactDep ? `версия ${reactDep.version}` : 'не найдена');
console.log('   📦 Компонент Header:', headerComponent ? `тип ${headerComponent.type}` : 'не найден');
console.log('   🔧 Сервис AuthService:', authService ? `методы ${authService.methods.join(', ')}` : 'не найден');

// 6. Пример загрузки микрофронтенда (симуляция)
console.log('\n6. Пример загрузки микрофронтенда:');
console.log('   📥 Симуляция загрузки микрофронтенда...');

// В реальном приложении здесь был бы вызов importMicrofront()
// importMicrofront('/path/to/microfront.umd.js', 'microfront-name', (result) => {
//   console.log('   ✅ Микрофронтенд загружен:', result);
// });

console.log('   ℹ️  В реальном приложении используйте:');
console.log('      importMicrofront(url, name, callback)');

// 7. Подписка на события (опционально)
console.log('\n7. Подписка на события реестра:');

const unsubscribe = registryEvents.on('component:added', (event) => {
  console.log(`   📢 Событие: компонент ${event.data.name} добавлен`);
});

// Добавляем новый компонент для демонстрации события
addComponent({
  name: 'Footer',
  type: 'react',
  version: '1.0.0',
  exports: ['Footer'],
  dependencies: ['react']
});

// Отписываемся от события
unsubscribe();

// 8. Очистка реестра
console.log('\n8. Очистка реестра:');
clearRegistry();
console.log('   ✅ Реестр очищен');

// 9. Проверка очистки
console.log('\n9. Проверка очистки реестра:');
console.log('   📚 Зависимостей:', getSharedDependency('react') ? 'есть' : 'нет');
console.log('   📦 Компонентов:', getComponent('Header') ? 'есть' : 'нет');
console.log('   🔧 Сервисов:', getService('AuthService') ? 'есть' : 'нет');

// 10. Отключаем отладку
console.log('\n10. Завершение работы:');
unsubscribeDebug();
console.log('   ✅ Отладка отключена');

console.log('\n🎉 Пример завершен!');
console.log('\n📋 Краткий обзор использованных функций:');
console.log('   • addSharedDependency() - добавление общей зависимости');
console.log('   • addComponent() - добавление компонента');
console.log('   • addService() - добавление сервиса');
console.log('   • getSharedDependency() - получение зависимости');
console.log('   • getComponent() - получение компонента');
console.log('   • getService() - получение сервиса');
console.log('   • clearRegistry() - очистка реестра');
console.log('   • importMicrofront() - загрузка микрофронтенда');
console.log('   • registryEvents.on() - подписка на события');
console.log('   • createDebugLogger() - отладка событий');

// Экспорт для использования в других примерах
module.exports = {
  addComponent,
  getComponent,
  addService,
  getService,
  addSharedDependency,
  getSharedDependency,
  clearRegistry,
  importMicrofront,
  registryEvents,
  createDebugLogger
};
