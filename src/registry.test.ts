/**
 * Tests for Microstix Registry Functions
 */

import {
  // Dependency functions
  getSharedDependency,
  replaceSharedDependency,
  deleteSharedDependency,
  addSharedDependency,

  // Component functions
  getComponent,
  replaceComponent,
  deleteComponent,
  addComponent,

  // Service functions
  getService,
  replaceService,
  deleteService,
  addService,

  // Registry management functions
  getAllDependencies,
  getAllComponents,
  getAllServices,
  getRegistry,
  clearRegistry,
  hasDependency,
  hasComponent,
  hasService,
} from './registry';

describe('Microstix Registry Functions', () => {
  beforeEach(() => {
    // Clear registry before each test
    clearRegistry();
  });

  describe('Dependency Functions', () => {
    test('should add and get a dependency', () => {
      const dep = { name: 'react', version: '18.2.0', alias: 'React' };
      addSharedDependency(dep);

      const retrieved = getSharedDependency('react');
      expect(retrieved).toEqual(dep);
    });

    test('should not add duplicate dependency', () => {
      const dep = { name: 'react', version: '18.2.0', alias: 'React' };
      addSharedDependency(dep);
      addSharedDependency({ ...dep, version: '19.0.0' }); // Try to add duplicate with different version

      const retrieved = getSharedDependency('react');
      expect(retrieved.version).toBe('18.2.0'); // Should keep original
    });

    test('should replace existing dependency', () => {
      const dep1 = { name: 'react', version: '18.2.0', alias: 'React' };
      const dep2 = { name: 'react', version: '19.0.0', alias: 'React' };

      addSharedDependency(dep1);
      replaceSharedDependency(dep2);

      const retrieved = getSharedDependency('react');
      expect(retrieved.version).toBe('19.0.0');
    });

    test('should delete dependency', () => {
      const dep = { name: 'react', version: '18.2.0', alias: 'React' };
      addSharedDependency(dep);

      expect(getSharedDependency('react')).toBeDefined();
      deleteSharedDependency('react');
      expect(getSharedDependency('react')).toBeUndefined();
    });

    test('should return undefined for non-existent dependency', () => {
      expect(getSharedDependency('non-existent')).toBeUndefined();
    });

    test('should check if dependency exists', () => {
      const dep = { name: 'react', version: '18.2.0', alias: 'React' };
      addSharedDependency(dep);

      expect(hasDependency('react')).toBe(true);
      expect(hasDependency('non-existent')).toBe(false);
    });
  });

  describe('Component Functions', () => {
    const mockComponent = {
      repository: 'ui-components',
      name: 'Button',
      version: '1.2.0',
      component: {
        type: 'button',
        props: { variant: 'primary', size: 'medium' },
      },
    };

    test('should add and get a component', () => {
      addComponent(mockComponent);

      const retrieved = getComponent('Button');
      expect(retrieved).toEqual(mockComponent);
    });

    test('should not add duplicate component', () => {
      addComponent(mockComponent);
      addComponent({ ...mockComponent, version: '2.0.0' });

      const retrieved = getComponent('Button');
      expect(retrieved.version).toBe('1.2.0'); // Should keep original
    });

    test('should replace existing component', () => {
      const updatedComponent = { ...mockComponent, version: '2.0.0' };

      addComponent(mockComponent);
      replaceComponent(updatedComponent);

      const retrieved = getComponent('Button');
      expect(retrieved.version).toBe('2.0.0');
    });

    test('should delete component', () => {
      addComponent(mockComponent);

      expect(getComponent('Button')).toBeDefined();
      deleteComponent('Button');
      expect(getComponent('Button')).toBeUndefined();
    });

    test('should return undefined for non-existent component', () => {
      expect(getComponent('non-existent')).toBeUndefined();
    });

    test('should check if component exists', () => {
      addComponent(mockComponent);

      expect(hasComponent('Button')).toBe(true);
      expect(hasComponent('non-existent')).toBe(false);
    });
  });

  describe('Service Functions', () => {
    const mockService = {
      repository: 'auth-service',
      name: 'AuthService',
      version: '1.5.0',
      service: {
        endpoints: ['/login', '/register'],
        authentication: 'jwt',
      },
    };

    test('should add and get a service', () => {
      addService(mockService);

      const retrieved = getService('AuthService');
      expect(retrieved).toEqual(mockService);
    });

    test('should not add duplicate service', () => {
      addService(mockService);
      addService({ ...mockService, version: '2.0.0' });

      const retrieved = getService('AuthService');
      expect(retrieved.version).toBe('1.5.0'); // Should keep original
    });

    test('should replace existing service', () => {
      const updatedService = { ...mockService, version: '2.0.0' };

      addService(mockService);
      replaceService(updatedService);

      const retrieved = getService('AuthService');
      expect(retrieved.version).toBe('2.0.0');
    });

    test('should delete service', () => {
      addService(mockService);

      expect(getService('AuthService')).toBeDefined();
      deleteService('AuthService');
      expect(getService('AuthService')).toBeUndefined();
    });

    test('should return undefined for non-existent service', () => {
      expect(getService('non-existent')).toBeUndefined();
    });

    test('should check if service exists', () => {
      addService(mockService);

      expect(hasService('AuthService')).toBe(true);
      expect(hasService('non-existent')).toBe(false);
    });
  });

  describe('Registry Management Functions', () => {
    beforeEach(() => {
      // Add some test data
      addSharedDependency({ name: 'dep1', version: '1.0.0', alias: 'Dep1' });
      addSharedDependency({ name: 'dep2', version: '2.0.0', alias: 'Dep2' });

      addComponent({
        repository: 'repo1',
        name: 'Comp1',
        version: '1.0.0',
        component: { type: 'type1', props: {} },
      });

      addService({
        repository: 'repo2',
        name: 'Svc1',
        version: '1.0.0',
        service: { endpoints: ['/test'] },
      });
    });

    test('should get all dependencies', () => {
      const deps = getAllDependencies();
      expect(Object.keys(deps)).toHaveLength(2);
      expect(deps.dep1).toBeDefined();
      expect(deps.dep2).toBeDefined();
    });

    test('should get all components', () => {
      const comps = getAllComponents();
      expect(Object.keys(comps)).toHaveLength(1);
      expect(comps.Comp1).toBeDefined();
    });

    test('should get all services', () => {
      const svcs = getAllServices();
      expect(Object.keys(svcs)).toHaveLength(1);
      expect(svcs.Svc1).toBeDefined();
    });

    test('should get full registry', () => {
      const registry = getRegistry();

      expect(registry.dependencies).toBeDefined();
      expect(registry.components).toBeDefined();
      expect(registry.services).toBeDefined();

      expect(Object.keys(registry.dependencies)).toHaveLength(2);
      expect(Object.keys(registry.components)).toHaveLength(1);
      expect(Object.keys(registry.services)).toHaveLength(1);
    });

    test('should clear registry', () => {
      // Verify data exists
      expect(Object.keys(getAllDependencies())).toHaveLength(2);
      expect(Object.keys(getAllComponents())).toHaveLength(1);
      expect(Object.keys(getAllServices())).toHaveLength(1);

      // Clear
      clearRegistry();

      // Verify cleared
      expect(Object.keys(getAllDependencies())).toHaveLength(0);
      expect(Object.keys(getAllComponents())).toHaveLength(0);
      expect(Object.keys(getAllServices())).toHaveLength(0);
    });

    test('should return copies, not references', () => {
      const deps = getAllDependencies();
      deps.newDep = { name: 'newDep', version: '1.0.0', alias: 'NewDep' };

      const depsAgain = getAllDependencies();
      expect(depsAgain.newDep).toBeUndefined(); // Should not affect original
    });
  });

  describe('Integration Tests', () => {
    test('should manage mixed types independently', () => {
      // Add one of each type with same name
      addSharedDependency({ name: 'shared', version: '1.0.0', alias: 'Shared' });

      addComponent({
        repository: 'test',
        name: 'shared',
        version: '2.0.0',
        component: { type: 'test', props: {} },
      });

      addService({
        repository: 'test',
        name: 'shared',
        version: '3.0.0',
        service: { endpoints: ['/test'] },
      });

      // Each should be retrievable independently
      expect(getSharedDependency('shared')).toBeDefined();
      expect(getComponent('shared')).toBeDefined();
      expect(getService('shared')).toBeDefined();

      // Each should have correct version
      expect(getSharedDependency('shared')?.version).toBe('1.0.0');
      expect(getComponent('shared')?.version).toBe('2.0.0');
      expect(getService('shared')?.version).toBe('3.0.0');
    });

    test('should handle multiple operations', () => {
      // Add multiple items
      addSharedDependency({ name: 'dep1', version: '1.0.0', alias: 'Dep1' });
      addSharedDependency({ name: 'dep2', version: '2.0.0', alias: 'Dep2' });

      // Update one
      replaceSharedDependency({ name: 'dep1', version: '1.1.0', alias: 'Dep1' });

      // Delete one
      deleteSharedDependency('dep2');

      // Add new one
      addSharedDependency({ name: 'dep3', version: '3.0.0', alias: 'Dep3' });

      const deps = getAllDependencies();
      expect(Object.keys(deps)).toHaveLength(2);
      expect(deps.dep1.version).toBe('1.1.0');
      expect(deps.dep2).toBeUndefined();
      expect(deps.dep3.version).toBe('3.0.0');
    });
  });
});
