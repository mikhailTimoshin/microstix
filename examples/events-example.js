/**
 * Пример использования системы событий Microstix
 *
 * Этот пример демонстрирует, как использовать систему событий
 * для отслеживания изменений в реестре микрофронтендов.
 */

const {
  registryEvents,
  createDebugLogger,
  addComponent,
  addService,
  addSharedDependency,
  clearRegistry,
  getComponent,
  getService,
  getSharedDependency
} = require('../dist/index.js');

console.log('🚀 Пример использования системы событий Microstix\n');

// 1. Создаем логгер для отладки всех событий
console.log('1. Создаем логгер для отладки всех событий:');
const unsubscribeDebug = createDebugLogger('[Events Debug]');

// 2. Подписываемся на конкретные события
console.log('\n2. Подписываемся на конкретные события:');

// Подписка на добавление компонентов
const unsubscribeComponents = registryEvents.on('component:added', (event) => {
  console.log(`   📦 Компонент добавлен: ${event.data.name}`);
  console.log(`      Данные:`, event.data.component);
});

// Подписка на добавление сервисов
const unsubscribeServices = registryEvents.on('service:added', (event) => {
  console.log(`   🔧 Сервис добавлен: ${event.data.name}`);
  console.log(`      Данные:`, event.data.service);
});

// Подписка на добавление зависимостей
const unsubscribeDependencies = registryEvents.on('dependency:added', (event) => {
  console.log(`   📚 Зависимость добавлена: ${event.data.name}`);
  console.log(`      Версия: ${event.data.dependency.version}`);
});

// Подписка на очистку реестра
const unsubscribeClear = registryEvents.on('registry:cleared', (event) => {
  console.log(`   🧹 Реестр очищен в ${new Date(event.data.timestamp).toLocaleTimeString()}`);
});

// 3. Создаем тестовые данные
console.log('\n3. Создаем тестовые данные в реестре:');

// Добавляем зависимости
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

// Добавляем компоненты
addComponent({
  name: 'Header',
  type: 'react',
  version: '1.0.0',
  exports: ['Header', 'HeaderLogo', 'HeaderMenu'],
  dependencies: ['react', 'react-dom']
});

addComponent({
  name: 'Sidebar',
  type: 'react',
  version: '1.0.0',
  exports: ['Sidebar', 'SidebarItem', 'SidebarMenu'],
  dependencies: ['react']
});

// Добавляем сервисы
addService({
  name: 'AuthService',
  type: 'authentication',
  version: '1.0.0',
  methods: ['login', 'logout', 'getUser'],
  dependencies: []
});

addService({
  name: 'ApiService',
  type: 'api',
  version: '1.0.0',
  methods: ['get', 'post', 'put', 'delete'],
  dependencies: []
});

// 4. Проверяем состояние реестра
console.log('\n4. Проверяем состояние реестра:');
console.log('   📚 Зависимостей:', Object.keys(getSharedDependency('react') ? { react: true, 'react-dom': true } : {}).length);
console.log('   📦 Компонентов:', Object.keys(getComponent('Header') ? { Header: true, Sidebar: true } : {}).length);
console.log('   🔧 Сервисов:', Object.keys(getService('AuthService') ? { AuthService: true, ApiService: true } : {}).length);

// 5. Отписываемся от некоторых событий
console.log('\n5. Отписываемся от событий компонентов:');
unsubscribeComponents();
console.log('   ✅ Отписаны от событий компонентов');

// 6. Добавляем еще один компонент (событие не будет обработано)
console.log('\n6. Добавляем компонент после отписки:');
addComponent({
  name: 'Footer',
  type: 'react',
  version: '1.0.0',
  exports: ['Footer'],
  dependencies: ['react']
});
console.log('   ℹ️  Событие не было обработано (мы отписались)');

// 7. Используем подписку на одно событие
console.log('\n7. Используем подписку на одно событие:');
const unsubscribeOnce = registryEvents.once('component:added', (event) => {
  console.log(`   🎯 Обработано одно событие: ${event.data.name}`);
});

// Добавляем два компонента, но обработается только первое событие
addComponent({
  name: 'Modal',
  type: 'react',
  version: '1.0.0',
  exports: ['Modal'],
  dependencies: ['react', 'react-dom']
});

addComponent({
  name: 'Tooltip',
  type: 'react',
  version: '1.0.0',
  exports: ['Tooltip'],
  dependencies: ['react']
});

// 8. Получаем историю событий
console.log('\n8. Получаем историю событий:');
const history = registryEvents.getHistory();
console.log(`   📊 Всего событий: ${history.length}`);
console.log(`   📈 Типы событий:`, [...new Set(history.map(event => event.type))]);

// 9. Очищаем реестр
console.log('\n9. Очищаем реестр:');
clearRegistry();
console.log('   ✅ Реестр очищен');

// 10. Проверяем состояние после очистки
console.log('\n10. Проверяем состояние после очистки:');
console.log('   📚 Зависимостей:', Object.keys(getSharedDependency('react') || {}).length);
console.log('   📦 Компонентов:', Object.keys(getComponent('Header') || {}).length);
console.log('   🔧 Сервисов:', Object.keys(getService('AuthService') || {}).length);

// 11. Отписываемся от всех событий
console.log('\n11. Отписываемся от всех событий:');
unsubscribeDebug();
unsubscribeServices();
unsubscribeDependencies();
unsubscribeClear();
console.log('   ✅ Отписаны от всех событий');

// 12. Добавляем финальный элемент (события не будут обработаны)
console.log('\n12. Добавляем финальный элемент:');
addComponent({
  name: 'FinalComponent',
  type: 'react',
  version: '1.0.0',
  exports: ['Final'],
  dependencies: ['react']
});
console.log('   ℹ️  События не обрабатываются (все отписаны)');

// 13. Демонстрация подписки на категории событий
console.log('\n13. Демонстрация подписки на категории событий:');
const unsubscribeAllComponents = registryEvents.on('component:*', (event) => {
  console.log(`   🎭 Событие категории component: ${event.type}`);
});

// Добавляем компоненты для демонстрации
addComponent({
  name: 'DemoComponent',
  type: 'react',
  version: '1.0.0',
  exports: ['Demo'],
  dependencies: ['react']
});

// Отписываемся
unsubscribeAllComponents();

console.log('\n🎉 Пример завершен!');
console.log('\n📋 Краткое описание возможностей системы событий:');
console.log('   • Подписка на конкретные события (component:added, service:removed, etc.)');
console.log('   • Подписка на категории событий (component:*, dependency:*)');
console.log('   • Подписка на одно событие (once)');
console.log('   • История всех событий');
console.log('   • Отладка через createDebugLogger()');
console.log('   • Автоматическая очистка подписок при отписке');

// Экспортируем для использования в других примерах
module.exports = {
  registryEvents,
  createDebugLogger,
  // Реэкспортируем основные функции
  addComponent,
  addService,
  addSharedDependency,
  clearRegistry
};
