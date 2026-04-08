/**
 * Система событий для реестра Microstix
 * Позволяет отслеживать изменения в реестре зависимостей, компонентов и сервисов
 */

export type EventType =
  | 'dependency:added'
  | 'dependency:updated'
  | 'dependency:removed'
  | 'component:added'
  | 'component:updated'
  | 'component:removed'
  | 'service:added'
  | 'service:updated'
  | 'service:removed'
  | 'registry:cleared'
  | 'registry:initialized';

export interface RegistryEvent<T = any> {
  type: EventType;
  data: T;
  timestamp: number;
  source?: string;
}

export type EventHandler<T = any> = (event: RegistryEvent<T>) => void;

/**
 * Класс для управления событиями реестра
 */
export class RegistryEventEmitter {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private history: RegistryEvent[] = [];
  private maxHistorySize: number = 100;

  /**
   * Подписаться на событие
   */
  on<T = any>(eventType: EventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const handlers = this.handlers.get(eventType)!;
    handlers.add(handler as EventHandler);

    // Возвращаем функцию отписки
    return () => {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }

  /**
   * Подписаться на событие один раз
   */
  once<T = any>(eventType: EventType, handler: EventHandler<T>): () => void {
    const onceHandler: EventHandler<T> = (event) => {
      handler(event);
      unsubscribe();
    };

    const unsubscribe = this.on(eventType, onceHandler);
    return unsubscribe;
  }

  /**
   * Отписаться от события
   */
  off(eventType: EventType, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  /**
   * Отправить событие
   */
  emit<T = any>(eventType: EventType, data: T, source?: string): void {
    const event: RegistryEvent<T> = {
      type: eventType,
      data,
      timestamp: Date.now(),
      source
    };

    // Сохраняем в историю
    this.history.push(event as RegistryEvent);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    // Вызываем обработчики
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event as RegistryEvent);
        } catch (error) {
          console.error(`Ошибка в обработчике события ${eventType}:`, error);
        }
      });
    }

    // Также вызываем обработчики для общих событий
    if (eventType.includes(':')) {
      const [category] = eventType.split(':');
      const categoryHandlers = this.handlers.get(`${category}:*` as EventType);
      if (categoryHandlers) {
        categoryHandlers.forEach(handler => {
          try {
            handler(event as RegistryEvent);
          } catch (error) {
            console.error(`Ошибка в обработчике события ${category}:*:`, error);
          }
        });
      }
    }
  }

  /**
   * Получить историю событий
   */
  getHistory(): RegistryEvent[] {
    return [...this.history];
  }

  /**
   * Очистить историю событий
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Получить количество подписчиков на событие
   */
  getListenerCount(eventType: EventType): number {
    const handlers = this.handlers.get(eventType);
    return handlers ? handlers.size : 0;
  }

  /**
   * Получить все типы событий с подписчиками
   */
  getEventTypes(): EventType[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Очистить все подписки
   */
  removeAllListeners(eventType?: EventType): void {
    if (eventType) {
      this.handlers.delete(eventType);
    } else {
      this.handlers.clear();
    }
  }
}

/**
 * Глобальный экземпляр эмиттера событий
 */
export const registryEvents = new RegistryEventEmitter();

/**
 * Вспомогательные функции для работы с событиями
 */

/**
 * Создать событие добавления зависимости
 */
export function createDependencyAddedEvent(name: string, dependency: any, source?: string): RegistryEvent {
  return {
    type: 'dependency:added',
    data: { name, dependency },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие обновления зависимости
 */
export function createDependencyUpdatedEvent(name: string, oldDependency: any, newDependency: any, source?: string): RegistryEvent {
  return {
    type: 'dependency:updated',
    data: { name, oldDependency, newDependency },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие удаления зависимости
 */
export function createDependencyRemovedEvent(name: string, dependency: any, source?: string): RegistryEvent {
  return {
    type: 'dependency:removed',
    data: { name, dependency },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие добавления компонента
 */
export function createComponentAddedEvent(name: string, component: any, source?: string): RegistryEvent {
  return {
    type: 'component:added',
    data: { name, component },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие обновления компонента
 */
export function createComponentUpdatedEvent(name: string, oldComponent: any, newComponent: any, source?: string): RegistryEvent {
  return {
    type: 'component:updated',
    data: { name, oldComponent, newComponent },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие удаления компонента
 */
export function createComponentRemovedEvent(name: string, component: any, source?: string): RegistryEvent {
  return {
    type: 'component:removed',
    data: { name, component },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие добавления сервиса
 */
export function createServiceAddedEvent(name: string, service: any, source?: string): RegistryEvent {
  return {
    type: 'service:added',
    data: { name, service },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие обновления сервиса
 */
export function createServiceUpdatedEvent(name: string, oldService: any, newService: any, source?: string): RegistryEvent {
  return {
    type: 'service:updated',
    data: { name, oldService, newService },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие удаления сервиса
 */
export function createServiceRemovedEvent(name: string, service: any, source?: string): RegistryEvent {
  return {
    type: 'service:removed',
    data: { name, service },
    timestamp: Date.now(),
    source
  };
}

/**
 * Создать событие очистки реестра
 */
export function createRegistryClearedEvent(source?: string): RegistryEvent {
  return {
    type: 'registry:cleared',
    data: { timestamp: Date.now() },
    timestamp: Date.now(),
    source
  };
}

/**
 * Декоратор для добавления событий к функциям реестра
 */
export function withEvents<T extends (...args: any[]) => any>(
  fn: T,
  eventType: EventType,
  getEventData: (...args: Parameters<T>) => any,
  source?: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const result = fn(...args);

    // Создаем событие
    const eventData = getEventData(...args);
    registryEvents.emit(eventType, eventData, source);

    return result;
  }) as T;
}

/**
 * Типы для подписки на события
 */
export interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Утилиты для отладки событий
 */
export function createDebugLogger(prefix: string = '[Microstix Events]') {
  return registryEvents.on('*' as EventType, (event) => {
    console.log(`${prefix} ${event.type}:`, event.data);
  });
}

/**
 * Экспорт типов для использования в других модулях
 */
