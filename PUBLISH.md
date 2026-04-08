# Publishing Microstix Registry Library to npm

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/signup) if you don't have one
2. **Node.js**: Ensure you have Node.js installed (version 16 or higher)
3. **Git**: For version control (optional but recommended)

## About This Library

Microstix Registry Library is a TypeScript library for centralized dependency, component, and service management in microservices architectures. It provides:

- **Shared Dependency Registry**: Centralized management of shared dependencies across services
- **Component Registry**: Registry for UI/components with versioning and metadata
- **Service Registry**: Service discovery and management with version control
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Zero Dependencies**: Lightweight with no external runtime dependencies

## Step-by-Step Publishing Guide

### Step 1: Prepare Your Package

1. **Update package.json**:
   - Change the `name` field to your desired package name (e.g., `microstix-registry` or `@yourusername/microstix-registry`)
   - Update `author` with your information
   - Update `repository.url` with your GitHub repository URL
   - Update `bugs.url` and `homepage` with your repository links
   - Update `version` if needed (start with 0.1.0 or 1.0.0)
   - Update `description` if needed (e.g., "TypeScript registry for microservices dependencies, components, and services")

2. **Build the library**:
   ```bash
   npm run build
   ```
   This will create the `dist/` directory with compiled JavaScript files and TypeScript definitions.

### Step 2: Test Locally

Before publishing, test the package locally:

1. **Create a test project**:
   ```bash
   mkdir test-project
   cd test-project
   npm init -y
   ```

2. **Install your library locally**:
   ```bash
   npm install ../microstix/library
   ```

3. **Create a test file**:
   ```javascript
   // test.js
   const { 
     addSharedDependency, 
     getSharedDependency,
     addComponent,
     getComponent,
     addService,
     getService,
     clearRegistry 
   } = require('microstix-library');
   
   function test() {
     clearRegistry();
     
     // Test dependency management
     addSharedDependency({ name: 'react', version: '18.2.0', alias: 'React' });
     const react = getSharedDependency('react');
     console.log('Dependency test:', react ? 'PASS' : 'FAIL');
     
     // Test component management
     addComponent({
       repository: 'ui-components',
       name: 'Button',
       version: '1.0.0',
       component: { type: 'button', props: {} }
     });
     const button = getComponent('Button');
     console.log('Component test:', button ? 'PASS' : 'FAIL');
     
     // Test service management
     addService({
       repository: 'auth-service',
       name: 'AuthService',
       version: '1.0.0',
       service: { endpoints: ['/login'] }
     });
     const auth = getService('AuthService');
     console.log('Service test:', auth ? 'PASS' : 'FAIL');
     
     console.log('All tests completed!');
   }
   
   test();
   ```

4. **Run the test**:
   ```bash
   node test.js
   ```

5. **Run the comprehensive example**:
   ```bash
   # From the library directory
   node example.js
   ```

### Step 3: Login to npm

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email address
- One-time password (if you have 2FA enabled)

Verify you're logged in:
```bash
npm whoami
```

**Note for scoped packages**: If you're using a scoped package name like `@yourusername/microstix-registry`, you may need to publish with public access:
```bash
npm publish --access public
```

### Step 4: Publish the Package

#### For Public Package (unscoped):
```bash
npm publish
```

#### For Scoped Package (recommended):
If you use `@yourusername/microstix-registry` as the package name:
```bash
npm publish --access public
```

#### For Private Package:
```bash
npm publish --access restricted
```

**Package Name Suggestions**:
- `microstix-registry` - Simple and descriptive
- `@yourusername/microstix-registry` - Scoped for personal/organization use
- `microservices-registry` - More generic
- `shared-deps-registry` - Focus on dependency management

### Step 5: Verify Publication

1. Check npm website:
   ```
   https://www.npmjs.com/package/your-package-name
   ```

2. Test installation from npm:
   ```bash
   mkdir verify-install
   cd verify-install
   npm init -y
   npm install your-package-name
   ```

3. Create a verification script:
   ```javascript
   // verify.js
   const { 
     addSharedDependency, 
     getSharedDependency,
     clearRegistry 
   } = require('your-package-name');
   
   clearRegistry();
   addSharedDependency({ name: 'test', version: '1.0.0', alias: 'Test' });
   const result = getSharedDependency('test');
   
   if (result && result.name === 'test') {
     console.log('✅ Package installed and working correctly!');
   } else {
     console.log('❌ Package verification failed');
   }
   ```

4. Run verification:
   ```bash
   node verify.js
   ```

### Step 6: Update the Package

When you make changes:

1. Update the version in `package.json` following [semantic versioning](https://semver.org/):
   - `patch` (0.1.1): Bug fixes, documentation updates
   - `minor` (0.2.0): New features (backward compatible), new registry functions
   - `major` (1.0.0): Breaking API changes, major refactoring

2. Update CHANGELOG.md (create one if it doesn't exist)

3. Build and test:
   ```bash
   npm run build
   node example.js
   ```

4. Publish the update:
   ```bash
   npm publish
   ```

**Version History Example**:
- `0.1.0`: Initial release with basic registry functions
- `0.2.0`: Added bulk operations and search functionality
- `0.3.0`: Added validation and serialization utilities
- `1.0.0`: Stable API, production-ready

## Best Practices

### Package Name
- **Unique**: Check if the name is available on npm
- **Descriptive**: Use names that describe the package's purpose (e.g., `microstix-registry`, `shared-deps-manager`)
- **Scoped**: Consider using `@yourusername/package-name` for personal/organization packages
- **Keywords**: Include relevant keywords in package.json: `microservices`, `registry`, `dependencies`, `typescript`, `shared`

### Versioning
- Start with `0.1.0` for initial development
- Move to `1.0.0` when the API is stable and tested
- Use semantic versioning consistently
- Document breaking changes in CHANGELOG.md

### Documentation
- Keep README.md up to date with all API functions
- Include comprehensive examples (see `example.js`)
- Document all public APIs with TypeScript examples
- List dependencies (currently only TypeScript as dev dependency)
- Include TypeScript usage examples
- Add JSDoc comments to source code for better IDE support

### Quality
- Include TypeScript definitions (already done - `.d.ts` files in `dist/`)
- Add tests (basic test file `registry.test.ts` included)
- Use CI/CD for automated testing and publishing (GitHub Actions example below)
- Add a LICENSE file (MIT already included)
- Include example file (`example.js`) demonstrating all features
- Maintain zero runtime dependencies for lightweight usage

## Troubleshooting

### Common Issues

1. **"Package name already exists"**:
   - Choose a different name
   - Use scoped naming: `@yourusername/package-name`
   - Check availability: `npm search package-name`

2. **"You do not have permission to publish"**:
   - Make sure you're logged in: `npm whoami`
   - Check if the package name is taken by another user
   - For scoped packages, use `npm publish --access public`
   - Verify you own the scope: `npm owner ls @yourusername`

3. **"Invalid package version"**:
   - Version must follow semver format: `major.minor.patch`
   - Cannot republish same version (must increment)
   - Check `package.json` for correct version format

4. **Build errors**:
   - Run `npm run build` to check for TypeScript errors
   - Ensure `dist/` directory is created with `.js`, `.d.ts`, and `.map` files
   - Check TypeScript version compatibility

5. **TypeScript definition issues**:
   - Ensure `declaration: true` in `tsconfig.json`
   - Verify `.d.ts` files are generated in `dist/` directory
   - Test TypeScript usage in a separate project

### Useful Commands

```bash
# View package info
npm view your-package-name

# View specific version
npm view your-package-name@0.1.0

# Unpublish (within 72 hours of publishing)
npm unpublish your-package-name --force

# Deprecate a version
npm deprecate your-package-name@"< 1.0.0" "Critical security fix in 1.0.0"

# Add collaborators
npm owner add username your-package-name

# List owners
npm owner ls your-package-name

# Remove owner
npm owner rm username your-package-name

# Check package size
npm pack --dry-run

# Test package locally without publishing
npm link
```

## Advanced: Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org/'
      - run: npm ci
      - run: npm run build
      - run: node example.js  # Run example to verify functionality
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Additional Workflow for Testing

Create `.github/workflows/test.yml`:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run

## Support

- **Issues**: Use GitHub Issues for bug reports
- **Questions**: Use GitHub Discussions or Stack Overflow
- **Contributions**: Follow CONTRIBUTING.md guidelines

## Legal

- Ensure you have the right to publish the code
- Include appropriate licenses
- Respect intellectual property rights

---

**Congratulations!** Your TypeScript library is now published on npm and ready for others to use.