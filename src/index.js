const fs = require('fs');
const path = require('path');

// ler diretório
function readDir(pathDir) {
    return new Promise((resolve) => {
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
            });
    });
}

readDir('./src/file')
    .then((result) => {
        console.log(result);
    });

// ler arquivo(file)
function readFile (file) {
    const isMd = path.extname(file) === '.md';
    if (!isMd) {
        const errorMessage = new Error ('Error: O arquivo não é Markdown');
        return Promise.reject(errorMessage);
    }
    return fs.promises.readFile(file).then(data => {
        return {
            file: file,
            data: data.toString()
        };
    });
}

// ler os caminhos (readDir e readFile)
function read(path) {
    return fs.promises.stat(path)
        .then(infoStatsObj => {
            if (infoStatsObj.isDirectory(path)) {
                return readDir(path);
            } else {
                return readFile(path);
            }
        });
}

module.exports = {
    readDir,
    readFile,
    read
};
