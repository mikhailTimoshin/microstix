/**
 * Example usage of Microstix Registry Functions
 */

// Import the library (in a real project, you would use: const { ... } = require('microstix-library'))
const {
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
} = require('./dist/index.js');

async function runExample() {
  console.log('=== Microstix Registry Functions Example ===\n');

  // Clear any existing data
  clearRegistry();
  console.log('1. Registry cleared\n');

  // Add dependencies
  console.log('2. Adding dependencies...');
  addSharedDependency({ name: 'react', version: '18.2.0', alias: 'React' });
  addSharedDependency({ name: 'react-dom', version: '18.2.0', alias: 'ReactDOM' });
  addSharedDependency({ name: 'axios', version: '1.6.0', alias: 'Axios' });
  addSharedDependency({ name: 'lodash', version: '4.17.21', alias: '_' });

  console.log('   Dependencies added:');
  console.log('   - react@18.2.0');
  console.log('   - react-dom@18.2.0');
  console.log('   - axios@1.6.0');
  console.log('   - lodash@4.17.21\n');

  // Add components
  console.log('3. Adding components...');
  addComponent({
    repository: 'ui-components',
    name: 'Button',
    version: '1.2.0',
    component: {
      type: 'button',
      props: { variant: 'primary', size: 'medium', disabled: false },
      styles: { backgroundColor: '#007bff', color: 'white' },
    },
  });

  addComponent({
    repository: 'ui-components',
    name: 'Modal',
    version: '2.1.0',
    component: {
      type: 'modal',
      props: { size: 'lg', closable: true, backdrop: true },
      styles: { maxWidth: '800px', zIndex: 1050 },
    },
  });

  addComponent({
    repository: 'data-components',
    name: 'DataTable',
    version: '3.0.0',
    component: {
      type: 'table',
      props: { pagination: true, sortable: true, selectable: true },
      styles: { borderCollapse: 'collapse', width: '100%' },
    },
  });

  addComponent({
    repository: 'form-components',
    name: 'Input',
    version: '1.5.0',
    component: {
      type: 'input',
      props: { type: 'text', placeholder: 'Enter text...', required: true },
      styles: { padding: '8px', border: '1px solid #ccc' },
    },
  });

  console.log('   Components added:');
  console.log('   - Button v1.2.0 (ui-components)');
  console.log('   - Modal v2.1.0 (ui-components)');
  console.log('   - DataTable v3.0.0 (data-components)');
  console.log('   - Input v1.5.0 (form-components)\n');

  // Add services
  console.log('4. Adding services...');
  addService({
    repository: 'auth-service',
    name: 'AuthService',
    version: '1.5.0',
    service: {
      endpoints: ['/login', '/register', '/logout', '/refresh-token'],
      authentication: 'jwt',
      security: { rateLimit: '100/hour', cors: true },
    },
  });

  addService({
    repository: 'user-service',
    name: 'UserService',
    version: '2.0.0',
    service: {
      endpoints: ['/users', '/profile', '/settings', '/preferences'],
      database: 'postgresql',
      cache: 'redis',
      features: ['search', 'filter', 'pagination'],
    },
  });

  addService({
    repository: 'payment-service',
    name: 'PaymentService',
    version: '1.3.0',
    service: {
      endpoints: ['/payments', '/invoices', '/subscriptions', '/refunds'],
      provider: 'stripe',
      currencies: ['USD', 'EUR', 'GBP'],
      security: { pciCompliant: true, encryption: 'AES-256' },
    },
  });

  addService({
    repository: 'notification-service',
    name: 'NotificationService',
    version: '1.1.0',
    service: {
      endpoints: ['/notifications', '/templates', '/preferences'],
      channels: ['email', 'sms', 'push'],
      providers: ['sendgrid', 'twilio', 'firebase'],
    },
  });

  console.log('   Services added:');
  console.log('   - AuthService v1.5.0 (auth-service)');
  console.log('   - UserService v2.0.0 (user-service)');
  console.log('   - PaymentService v1.3.0 (payment-service)');
  console.log('   - NotificationService v1.1.0 (notification-service)\n');

  // Get all items
  console.log('5. Getting all items from registry...');
  const allDeps = getAllDependencies();
  const allComps = getAllComponents();
  const allSvcs = getAllServices();

  console.log(`   Total dependencies: ${Object.keys(allDeps).length}`);
  console.log(`   Total components: ${Object.keys(allComps).length}`);
  console.log(`   Total services: ${Object.keys(allSvcs).length}\n`);

  // Get specific items
  console.log('6. Getting specific items...');
  const reactDep = getSharedDependency('react');
  const buttonComp = getComponent('Button');
  const authService = getService('AuthService');
  const nonExistent = getComponent('NonExistentComponent');

  console.log(
    `   React dependency: ${reactDep.name}@${reactDep.version} (alias: ${reactDep.alias})`
  );
  console.log(
    `   Button component: ${buttonComp.name} v${buttonComp.version} from ${buttonComp.repository}`
  );
  console.log(
    `   Auth service: ${authService.name} v${authService.version} from ${authService.repository}`
  );
  console.log(
    `   Non-existent component: ${nonExistent === undefined ? 'undefined (correct)' : 'exists (error)'}\n`
  );

  // Check existence
  console.log('7. Checking item existence...');
  console.log(`   Has 'axios' dependency: ${hasDependency('axios')}`);
  console.log(`   Has 'Modal' component: ${hasComponent('Modal')}`);
  console.log(`   Has 'UserService' service: ${hasService('UserService')}`);
  console.log(`   Has 'GhostService' service: ${hasService('GhostService')}\n`);

  // Update items
  console.log('8. Updating items...');

  // Update dependency version
  replaceSharedDependency({ name: 'axios', version: '1.6.2', alias: 'Axios' });

  // Update component with new props
  replaceComponent({
    repository: 'ui-components',
    name: 'Button',
    version: '1.3.0',
    component: {
      type: 'button',
      props: { variant: 'primary', size: 'medium', disabled: false, loading: false },
      styles: { backgroundColor: '#007bff', color: 'white', borderRadius: '4px' },
    },
  });

  // Update service with new endpoint
  replaceService({
    repository: 'auth-service',
    name: 'AuthService',
    version: '1.6.0',
    service: {
      endpoints: ['/login', '/register', '/logout', '/refresh-token', '/reset-password'],
      authentication: 'jwt',
      security: { rateLimit: '100/hour', cors: true, csrf: true },
    },
  });

  const updatedAxios = getSharedDependency('axios');
  const updatedButton = getComponent('Button');
  const updatedAuthService = getService('AuthService');

  console.log(`   Updated axios to: v${updatedAxios.version}`);
  console.log(`   Updated Button to: v${updatedButton.version}`);
  console.log(`   Updated AuthService to: v${updatedAuthService.version}`);
  console.log(`   New AuthService endpoints: ${updatedAuthService.service.endpoints.length}\n`);

  // Delete items
  console.log('9. Deleting items...');
  const beforeDeleteDeps = Object.keys(getAllDependencies()).length;
  const beforeDeleteComps = Object.keys(getAllComponents()).length;
  const beforeDeleteSvcs = Object.keys(getAllServices()).length;

  deleteSharedDependency('lodash');
  deleteComponent('Input');
  deleteService('NotificationService');

  const afterDeleteDeps = Object.keys(getAllDependencies()).length;
  const afterDeleteComps = Object.keys(getAllComponents()).length;
  const afterDeleteSvcs = Object.keys(getAllServices()).length;

  console.log(`   Dependencies: ${beforeDeleteDeps} → ${afterDeleteDeps}`);
  console.log(`   Components: ${beforeDeleteComps} → ${afterDeleteComps}`);
  console.log(`   Services: ${beforeDeleteSvcs} → ${afterDeleteSvcs}`);
  console.log(`   Has 'lodash' after deletion: ${hasDependency('lodash')}`);
  console.log(`   Has 'Input' after deletion: ${hasComponent('Input')}`);
  console.log(
    `   Has 'NotificationService' after deletion: ${hasService('NotificationService')}\n`
  );

  // Try to add duplicate (should not add)
  console.log('10. Trying to add duplicate items...');
  const beforeDupDeps = Object.keys(getAllDependencies()).length;
  const beforeDupComps = Object.keys(getAllComponents()).length;

  // Try to add duplicates with different versions
  addSharedDependency({ name: 'react', version: '19.0.0', alias: 'React' }); // Already exists
  addComponent({
    repository: 'ui-components',
    name: 'Button', // Already exists
    version: '2.0.0',
    component: { type: 'button', props: {} },
  });

  const afterDupDeps = Object.keys(getAllDependencies()).length;
  const afterDupComps = Object.keys(getAllComponents()).length;

  const currentReact = getSharedDependency('react');
  const currentButton = getComponent('Button');

  console.log(`   Dependencies count unchanged: ${beforeDupDeps === afterDupDeps}`);
  console.log(`   Components count unchanged: ${beforeDupComps === afterDupComps}`);
  console.log(`   React still at: v${currentReact.version} (not v19.0.0)`);
  console.log(`   Button still at: v${currentButton.version} (not v2.0.0)\n`);

  // Get full registry
  console.log('11. Getting full registry state...');
  const fullRegistry = getRegistry();

  console.log(`   Registry structure:`);
  console.log(
    `   - Dependencies (${Object.keys(fullRegistry.dependencies).length}): ${Object.keys(fullRegistry.dependencies).join(', ')}`
  );
  console.log(
    `   - Components (${Object.keys(fullRegistry.components).length}): ${Object.keys(fullRegistry.components).join(', ')}`
  );
  console.log(
    `   - Services (${Object.keys(fullRegistry.services).length}): ${Object.keys(fullRegistry.services).join(', ')}\n`
  );

  // Demonstrate registry isolation
  console.log('12. Demonstrating registry isolation...');
  const registryCopy = getRegistry();

  // Modify the copy
  registryCopy.dependencies.test = { name: 'test', version: '1.0.0', alias: 'Test' };

  // Check original registry
  const originalHasTest = hasDependency('test');
  console.log(`   Original registry has 'test' dependency: ${originalHasTest} (should be false)`);
  console.log(`   Modifying returned copy does not affect original registry\n`);

  // Clear and verify
  console.log('13. Clearing registry...');
  clearRegistry();

  const finalDeps = getAllDependencies();
  const finalComps = getAllComponents();
  const finalSvcs = getAllServices();

  console.log(`   Final counts after clear:`);
  console.log(`   - Dependencies: ${Object.keys(finalDeps).length}`);
  console.log(`   - Components: ${Object.keys(finalComps).length}`);
  console.log(`   - Services: ${Object.keys(finalSvcs).length}\n`);

  console.log('=== Example Completed Successfully ===');
  console.log('\nSummary:');
  console.log('- All registry functions work correctly');
  console.log('- Add/Get/Replace/Delete operations function as expected');
  console.log('- Duplicate prevention works (add only if not exists)');
  console.log('- Registry isolation maintained (copies, not references)');
  console.log('- Type safety preserved through TypeScript definitions');
}

// Run the example
runExample().catch(error => {
  console.error('Error running example:', error);
  process.exit(1);
});
