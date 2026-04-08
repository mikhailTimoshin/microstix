#!/usr/bin/env node

/**
 * Microstix CLI - Минимальная конфигурация для микрофронтендов
 *
 * Использование:
 *   npx microstix-library create <name> [options]
 *   npx microstix-library generate [options]
 *   npx microstix-library validate
 *   npx microstix-library templates
 */

// Проверяем, что Node.js версии 16 или выше
const nodeVersion = process.versions.node.split('.')[0];
if (parseInt(nodeVersion) < 16) {
  console.error('❌ Microstix требует Node.js версии 16 или выше');
  console.error(`   Текущая версия: ${process.version}`);
  process.exit(1);
}

// Обработка ошибок
process.on('unhandledRejection', error => {
  console.error('❌ Необработанная ошибка:', error);
  process.exit(1);
});

process.on('uncaughtException', error => {
  console.error('❌ Непойманное исключение:', error);
  process.exit(1);
});

// Проверяем, что dist директория существует
const fs = require('fs');
const path = require('path');
const distPath = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distPath)) {
  console.error('❌ Директория dist не найдена');
  console.error('   Сначала выполните сборку: npm run build');
  process.exit(1);
}

// Проверяем, что основной файл существует
const mainFile = path.join(distPath, 'index.js');
if (!fs.existsSync(mainFile)) {
  console.error('❌ Основной файл библиотеки не найден');
  console.error('   Сначала выполните сборку: npm run build');
  process.exit(1);
}

// Загружаем и запускаем CLI
try {
  // Используем require для CommonJS модулей
  const { runCli } = require(mainFile);

  if (typeof runCli !== 'function') {
    console.error('❌ Функция runCli не найдена в библиотеке');
    process.exit(1);
  }

  // Запускаем CLI
  runCli().catch(error => {
    console.error('❌ Ошибка при запуске CLI:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('❌ Ошибка загрузки библиотеки:', error);
  console.error('   Убедитесь, что сборка выполнена: npm run build');
  process.exit(1);
}
