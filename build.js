// build.js - Versión Final
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// --- Rutas ---
const inputFile = './src/input.css';
const outputFile = './dist/output.css';
const sourceDir = './'; // Directorio raíz donde están index.html y assets
const targetDir = './dist'; // Directorio de salida

console.log('Iniciando el proceso de build completo...');

// --- Función para copiar archivos y carpetas ---
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// --- Lógica del Build ---
// 1. Asegurarse de que el directorio 'dist' exista y esté limpio
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir);

// 2. Compilar el CSS
console.log('Compilando CSS...');
const css = fs.readFileSync(inputFile);
postcss([tailwindcss, autoprefixer, cssnano({ preset: 'default' })])
  .process(css, { from: inputFile, to: outputFile })
  .then(result => {
    fs.writeFileSync(outputFile, result.css);
    console.log('CSS compilado exitosamente.');

    // 3. Copiar index.html
    console.log('Copiando index.html...');
    fs.copyFileSync(path.join(sourceDir, 'index.html'), path.join(targetDir, 'index.html'));

    // 4. Copiar la carpeta de assets (imágenes, etc.)
    // Asegúrate de que tu carpeta de imágenes se llame 'assets'. Si se llama 'img', cambia 'assets' por 'img' en la línea de abajo.
    const assetsDir = 'assets'; 
    if (fs.existsSync(path.join(sourceDir, assetsDir))) {
      console.log(`Copiando la carpeta '${assetsDir}'...`);
      copyRecursiveSync(path.join(sourceDir, assetsDir), path.join(targetDir, assetsDir));
    }
    
    console.log('¡Build completado exitosamente! La carpeta "dist" está lista para producción.');
  })
  .catch(error => {
    console.error('Error durante el build:', error);
    process.exit(1);
  });