
// FUNÇÃO DE STATS
/* const statsFunction = (arrayLinks) => {
    return new Promise((resolve) => {
        const { total, unique, broken } = arrayLinks.reduce(
            (stats, { href, ok }) => {
                stats.hrefList.add(href); // adiciona o href ao conjunto hrefList dentro do stats
                stats.broken += ok === "fail" ? 1 : 0; // se 'ok' for "fail" adiciona 1 no broken
                return stats;
            },
            {
                hrefList: new Set(), // set armazena valores únicos, não permitindo a sua duplicação
                broken: 0,
            }
        );

        const objStats = {
            total: arrayLinks.length,
            unique: hrefList.size, // Use hrefList.size to get the number of unique links
            broken: broken,
        };

        resolve(objStats);
    });
}; */


// FUNÇÃO DE VALIDATE url




module.exports = {
    // statsFunction,
};

/* mdLinks('./src/file/files.md')
    .then((links) => {
        console.log(links);
    })
    .catch((error) => {
        console.error(error.message);
    });
mdLinks('./src/file/files.md', { validate: true })
    .then((links) => {
        console.log(links);
    })
    .catch((error) => {
        console.error(error.message);
    });
mdLinks('./src/file', { validate: true })
    .then((links) => {
        console.log(links);
    })
    .catch((error) => {
        console.error(error.message);
    }); */