# ESLint Plugin: No Relative Import Paths (ESLint 10 Compatible)

This is a patched version of `eslint-plugin-no-relative-import-paths` (v1.6.1) that works with ESLint 10.

## Changes Made

The original plugin used deprecated ESLint APIs:
- `context.getCwd()` → Changed to `context.cwd` (with fallback for older ESLint versions)
- `context.getFilename()` → Changed to `context.filename` (with fallback for older ESLint versions)

## Original Plugin

- **Original Package**: [eslint-plugin-no-relative-import-paths](https://www.npmjs.com/package/eslint-plugin-no-relative-import-paths)
- **Original Author**: MelvinVermeer
- **Original Repository**: https://github.com/MelvinVermeer/eslint-plugin-no-relative-import-paths
- **Version**: 1.6.1
- **License**: ISC

## How to Publish as a Fork

If you want to create a proper fork and publish it:

1. **Fork the original repository** on GitHub:
   ```bash
   # Visit: https://github.com/MelvinVermeer/eslint-plugin-no-relative-import-paths
   # Click "Fork"
   ```

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/eslint-plugin-no-relative-import-paths
   cd eslint-plugin-no-relative-import-paths
   ```

3. **Apply the changes**:
   Replace `context.getCwd()` with:
   ```javascript
   const cwd = context.getCwd ? context.getCwd() : context.cwd;
   ```
   
   Replace `context.getFilename()` with:
   ```javascript
   const filename = context.getFilename ? context.getFilename() : context.filename;
   ```

4. **Update package.json**:
   - Change package name to `@YOUR_USERNAME/eslint-plugin-no-relative-import-paths`
   - Update version to `1.6.2` or `2.0.0`
   - Add `"eslint": ">=8.0.0"` to `peerDependencies`

5. **Publish to npm**:
   ```bash
   npm publish --access public
   ```

6. **Create a Pull Request** to the original repository with your changes

## Compatibility

- ✅ ESLint 8.x
- ✅ ESLint 9.x  
- ✅ ESLint 10.x

The backward compatibility is maintained through feature detection.
