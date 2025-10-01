// build.js
const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// Define las rutas de tus archivos
const inputFile = './src/input.css';
const outputFile = './dist/output.css';

console.log('Iniciando la compilación del CSS con el script de Node.js...');

// Lee el contenido de tu archivo CSS de entrada
fs.readFile(inputFile, (err, css) => {
  if (err) throw err;

  // Procesa el CSS con PostCSS, Tailwind, Autoprefixer y Cssnano (para minificar)
  postcss([
    tailwindcss,
    autoprefixer,
    cssnano({ preset: 'default' }) 
  ])
    .process(css, { from: inputFile, to: outputFile })
    .then(result => {
      // Asegúrate de que el directorio 'dist' exista antes de escribir el archivo
      if (!fs.existsSync('./dist')){
        fs.mkdirSync('./dist');
      }
      // Escribe el CSS procesado en el archivo de salida
      fs.writeFile(outputFile, result.css, () => true);
      console.log('CSS compilado y minificado exitosamente en', outputFile);
    })
    .catch(error => {
      console.error('Error durante la compilación de PostCSS:', error);
      process.exit(1); // Sale con un código de error para que Vercel sepa que falló
    });
});