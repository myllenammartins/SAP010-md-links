const { mdLinks, statsFunction } = require('./index.js');

const chalk = require('chalk');

const [, , path, ...args] = process.argv; // eslint-disable-line

const options = {
    validate: false,
    stats: false,
};

args.forEach((arg) => {
    if (arg === '--validate') {
        options.validate = true;
    } else if (arg === '--stats') {
        options.stats = true;
    }
});

/* const options = {
    validate: process.argv.includes('--validate'),
    stats: process.argv.includes('--stats'),
    validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats'),
}; */


mdLinks(path, options)
    .then((result) => {
        if (options.stats && options.validate) {
            console.log(chalk.green.bold('Validate statistics:'));
            console.log(chalk.cyan(`Total links: ${result.statistics.total}`));
            console.log(chalk.magenta(`Unique links: ${result.statistics.unique}`));
            console.log(chalk.bgRed(`Broken links: ${result.statistics.broken}`));
        } else if (options.stats) {
            console.log(chalk.green.bold('Statistics:'));
            statsFunction(result.links)
                .then((stats) => {
                    console.log(chalk.cyan(`Total links: ${stats.total}`));
                    console.log(chalk.magenta(`Unique links: ${stats.unique}`));
                    console.log(chalk.bgRed(`Broken links: ${stats.broken}`));
                })
                .catch((error) => {
                    console.error(error);
                });
        } else if (options.validate) {
            console.log(chalk.green.bold('Validate links:'));
            if (result.links && result.links.length > 0) {
                result.links.forEach((link) => {
                    console.log(chalk.yellow(`Link: ${link.href}`));
                    console.log(chalk.cyan(`Text: ${link.text}`));
                    console.log(chalk.green(`File: ${link.file}`));
                    console.log(chalk.magenta(`Status: ${link.ok}`));
                    console.log(chalk.cyan(`HTTP Status: ${link.status}`));
                    console.log(chalk.gray('----------------------------'));
                });
            } else {
                console.log(chalk.red('Não foi encontrado nenhum link neste arquivo.'));
            }
        } else {
            console.log(chalk.green.bold('Links:'));
            if (result.links && result.links.length > 0) {
                result.links.forEach((link) => {
                    console.log(chalk.yellow(`Link: ${link.href}`));
                    console.log(chalk.cyan(`Text: ${link.text}`));
                    console.log(chalk.green(`File: ${link.file}`));
                    console.log(chalk.gray('----------------------------'));
                });
            } else {
                console.log(chalk.bgRed('Não há links neste arquivo.'));
            }
        }
    })
    .catch((error) => {
        console.error(error);
    });
