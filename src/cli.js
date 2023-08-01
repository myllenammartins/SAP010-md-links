#!/usr/bin/env node
const { mdLinks } = require('./index.js');

const chalk = require('chalk');
const Table = require('cli-table3');

function statsFunction(arrayLinks) {
    let hrefList = [];
    let broken = 0;
    arrayLinks.forEach((element) => {
        hrefList.push(element.href);
        if (element.ok === 'fail') {
            broken++;
        }
    });

    const uniqueLinks = new Set(hrefList);

    const objStats = {
        total: hrefList.length,
        unique: uniqueLinks.size,
        broken: broken,
    };
    return objStats;
}

const [, , path, ...args] = process.argv; // eslint-disable-line

const options = {
    validate: false,
    stats: false
};

args.forEach((arg) => {
    if (arg === '--validate') {
        options.validate = true;
    } else if (arg === '--stats') {
        options.stats = true;
    }
});

function mdLinksCli(path, options) {
    mdLinks(path, options)
        .then((result) => {
            if (options.stats && options.validate) {
                console.log(chalk.whiteBright.inverse('Validate e stats:'));
                const stats = statsFunction(result.links);
                console.log(chalk.cyan(`Total: ${stats.total}`));
                console.log(chalk.green(`Unique: ${stats.unique}`));
                console.log(chalk.bgRed(`Broken: ${stats.broken}`));
            } else if (options.stats) {
                console.log(chalk.whiteBright.inverse('Stats:'));
                const stats = statsFunction(result.links);
                console.log(chalk.cyan(`Total: ${stats.total}`));
                console.log(chalk.green(`Unique: ${stats.unique}`));
            } else if (options.validate) {
                const table1 = new Table({
                    head: [chalk.yellow('Link'), chalk.yellow('text'), chalk.yellow('status'), chalk.yellow('HTTP Status')],
                    colWidths: [40, 20, 10, 20]
                });
                console.log(chalk.whiteBright.inverse('Validate links:'));
                if (result.links && result.links.length > 0) {
                    result.links.forEach((link) => {
                        const linksTable = chalk.cyan(link.href);
                        const textTable =(chalk.white(`${link.text}`));
                        const statusTable =(chalk.cyan(`${link.ok}`));
                        const httpTable =(chalk.white(`${link.status}`));
                        table1.push([ linksTable, textTable, statusTable, httpTable ]);
                    });
                    console.log(table1.toString());
                } else {
                    console.log(chalk.red('Não foi encontrado nenhum link neste arquivo.'));
                }
            } else {
                console.log(chalk.whiteBright.inverse('Links:'));
                if (result.links && result.links.length > 0) {
                    result.links.forEach((link) => {
                        console.log(chalk.yellow(`Link: ${link.href}`));
                        console.log(chalk.cyan(`Text: ${link.text}`));
                        console.log(chalk.green(`File: ${link.file}`));
                        console.log(chalk.white(`_______________________`));
                    });
                } else {
                    console.log(chalk.bgRed('Não há links neste arquivo.'));
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
  
mdLinksCli(path, options);
