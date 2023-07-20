const { mdLinks, statsFunction } = require('./index.js');

const chalk = require('chalk');

const [, , path, ...args] = process.argv; // eslint-disable-line

const options = {
    validate: false,
    stats: false,
    validateAndStats: false
};

args.forEach((arg) => {
    if (arg === '--validate') {
        options.validate = true;
    } else if (arg === '--stats') {
        options.stats = true;
    }
    if (args.includes('--validate') && args.includes('--stats')) {
        options.validateAndStats = true;
    }
});

function mdLinksCli(path, options) {
    mdLinks(path, options)
        .then((result) => {
            if (options.stats && options.validate) {
                console.log(chalk.whiteBright.inverse('Validate e stats:'));
                const stats = statsFunction(result.links);
                console.log(chalk.cyan(`Total: ${stats.total}`));
                console.log(chalk.magenta(`Unique: ${stats.unique}`));
                console.log(chalk.bgRed(`Broken: ${stats.broken}`));
            } else if (options.stats) {
                console.log(chalk.whiteBright.inverse('Stats:'));
                const stats = statsFunction(result.links);
                console.log(chalk.cyan(`Total: ${stats.total}`));
                console.log(chalk.magenta(`Unique: ${stats.unique}`));
                console.log(chalk.bgRed(`Broken: ${stats.broken}`));
            } else if (options.validate) {
                console.log(chalk.whiteBright.inverse('Validate links:'));
                if (result.links && result.links.length > 0) {
                    result.links.forEach((link) => {
                        console.log(chalk.yellow(`Link: ${link.href}`));
                        console.log(chalk.cyan(`Text: ${link.text}`));
                        console.log(chalk.green(`File: ${link.file}`));
                        console.log(chalk.magenta(`Status: ${link.ok}`));
                        console.log(chalk.cyan(`HTTP Status: ${link.status}`));
                    });
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
