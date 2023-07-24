const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

function readFile(file) {
    const isMd = path.extname(file) === '.md';
    if (!isMd) {
        const errorMessage = new Error('O arquivo não é Markdown');
        return Promise.reject(errorMessage);
    }
    return fs.promises.readFile(file, 'utf8').then((data) => ({
        file: file,
        data: data,
    }));
}

function readDir(pathDir) {
    return fs.promises.readdir(pathDir).then((files) => {
        const reading = files
            .filter((file) => path.extname(file) === '.md')
            .map((file) => readFile(path.resolve(pathDir, file)));
        return Promise.all(reading);
    });
}

function read(path) {
    return fs.promises.stat(path).then((infoStatsObj) => {
        if (infoStatsObj.isDirectory(path)) {
            return readDir(path);
        } else {
            return readFile(path);
        }
    });
}

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
                    link.status = 404;
                    link.ok = false;
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

function mdLinks(path, options = { validate: false }) {
    return read(path).then((data) => {
        const links = getLinks(data.data, data.file);
        if (!options.validate) {
            return { links };
        } else {
            return validateLinks(links).then((validatedLinks) => {
                return { links: validatedLinks };
            });
        }
    });
}

module.exports = {
    readDir,
    readFile,
    read,
    validateLinks,
    getLinks,
    mdLinks
};
