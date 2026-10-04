const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
};

const files = walk('./src/logic');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Convert requires: const X = require('Y') -> import X from 'Y'
  content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g, 'import $1 from \'$2\';');
  
  // Convert requires with destructuring: const { X, Y } = require('Z') -> import { X, Y } from 'Z'
  content = content.replace(/const\s+\{\s*([^}]+)\s*\}\s*=\s*require\(['"]([^'"]+)['"]\);?/g, 'import { $1 } from \'$2\';');

  // Convert exports: module.exports = X -> export default X
  content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, 'export default $1;');
  
  // Convert object exports: module.exports = { X, Y } -> export { X, Y }
  content = content.replace(/module\.exports\s*=\s*\{([^}]+)\};?/g, 'export { $1 };');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Converted ${file}`);
});
