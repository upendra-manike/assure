# 📦 Publishing Assure to npm

## Pre-publishing Checklist

- [ ] Update version in `package.json`
- [ ] Update repository URL in `package.json` (replace `yourusername` with your GitHub username)
- [ ] Update homepage URL in `package.json`
- [ ] Build the project: `npm run build`
- [ ] Test the build: `node dist/runner.js test.assure`
- [ ] Update CHANGELOG.md (if you have one)

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

### 2. Check package name availability

The package name `assure-testing` might be taken. Check availability:

```bash
npm view assure-testing
```

If taken, choose a different name and update `package.json`:
- `@yourusername/assure` (scoped package)
- `assure-dsl`
- `assure-testing-language`
- Or any available name

### 3. Build the project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 4. Test the package locally

```bash
# Test the built version
node dist/runner.js login.assure
```

### 5. Dry run (preview what will be published)

```bash
npm publish --dry-run
```

This shows what files will be included without actually publishing.

### 6. Publish to npm

```bash
# First time publishing
npm publish

# For subsequent versions
npm version patch  # or minor, major
npm publish
```

### 7. Verify publication

```bash
npm view assure-testing
```

## Post-publishing

1. Create a GitHub release
2. Update documentation with npm installation instructions
3. Share on social media/communities

## Version Management

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

## Troubleshooting

### Package name already taken
- Use a scoped package: `@yourusername/assure`
- Choose a different name

### Build errors
- Ensure TypeScript is installed: `npm install`
- Check `tsconfig.json` configuration
- Verify all imports use `.js` extension for ES modules

### Permission errors
- Make sure you're logged in: `npm whoami`
- Check if package name is available
- For scoped packages, ensure you have access

## Package Structure

The published package includes:
- `dist/` - Compiled JavaScript files
- `README.md` - Documentation
- `LICENSE` - MIT License
- `package.json` - Package metadata

Source TypeScript files are NOT included (they're in `.npmignore`).

