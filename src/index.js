const fs = require('fs');
const path = require('path');

// const chalk = require('chalk');

// ler diretório
function readDir(pathDir) {
  return new Promise((resolve, reject) => {
    fs.promises.readdir(pathDir)
      .then((files) => {
        const reading = files.filter(file => {
          return path.extname(file) === '.md';
        })
        .map(file => {
          return readFile(path.resolve(pathDir, file));
        });
        return Promise.all(reading).then((result) => {
          resolve(result);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

readDir('./src/file')
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

// ler arquivo(file)
function readFile(file) {
  const isMd = path.extname(file) === '.md';
  if (!isMd) {
    const errorMessage = chalk.red('Error: File is not a Markdown file');
    return Promise.reject(errorMessage);
  }
  return fs.promises.readFile(file).then(data => {
    return { file: file, data: data.toString() };
  });
}

module.exports = {
  readDir,
  readFile,
}