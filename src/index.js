const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// const chalk = require('chalk');

// ler arquivo(file)
/* function readFile (file) {
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
} */

function readFile(file) {
    const isMd = path.extname(file) === '.md';
    if (!isMd) {
        const errorMessage = new Error('Error: O arquivo não é Markdown');
        return Promise.reject(errorMessage);
    }
    return fs.promises.readFile(file, 'utf8').then(data => ({
        file: file,
        data: data
    }));
}

// ler diretório
/* function readDir(pathDir) {
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
} */

function readDir(pathDir) {
    return fs.promises.readdir(pathDir)
        .then((files) => {
            const reading = files.filter(file => path.extname(file) === '.md')
                .map(file => readFile(path.resolve(pathDir, file)));
            return Promise.all(reading);
        });
}

// ler os caminhos (readDir e readFile)
/* function read(path) {
    return fs.promises.stat(path)
        .then(infoStatsObj => {
            if (infoStatsObj.isDirectory(path)) {
                return readDir(path);
            } else {
                return readFile(path);
            }
        });
} */

/*readDir('./src/file')
    .then((result) => {
        console.log(result);
    }); */

// FUNÇÃO DE STATS
const statsFunction = (arrayLinks) => {

    return new Promise((resolve)=>{
        let hrefList = [];
        let broken = 0;
        arrayLinks.forEach(element => {
            hrefList.push(element.href);
            if(element.ok === false){
                broken++;
            }
        });

        const uniqueLinks = new Set(hrefList);

        const objStats = {
            total: hrefList.length,
            unique: uniqueLinks.size,
            broken: broken,
        };
        resolve(objStats);
    });
};

function validateLinks(arrayLinks) {
    return Promise.all(
        arrayLinks.map((link) => {
            return fetch(link.href)
                .then((response) => {
                    link.status = response.status;
                    link.ok = response.ok ? 'ok' : 'fail';
                    return link;
                })
                .catch(() => {
                    link.status = 'fail';
                    link.ok = 'fail';
                    return link;
                });
        })
    );
}

function getLinks(data, filePath) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = [...data.matchAll(linkRegex)];
    
    const links = matches.map((match) => {
        const text = match[1];
        const href = match[2];
        return { href, text, file: filePath };
    });
  
    return links;
}

function mdLinks(filePath, options = {}) {
    const absolutePath = path.resolve(filePath);
  
    return readFile(absolutePath)
        .then(({ data }) => {
            const links = getLinks(data, filePath);
  
            if (options.validate) {
                return validateLinks(links);
            } else {
                return { links }; // Retornar um objeto com a propriedade 'links'
            }
        });
}
  
module.exports = {
    readDir,
    readFile,
    //read,
    mdLinks,
    getLinks,
    statsFunction
};
