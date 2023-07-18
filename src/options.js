// const chalk = require('chalk');

// FUNÇÃO DE STATS
const statsFunction = (arrayLinks) => {
    const { total, unique, broken } = arrayLinks.reduce(
        (stats, { href, ok }) => {
            stats.hrefList.add(href); // adiciona o href ao conjunto hrefList dentro do stats
            stats.broken += ok === false ? 1 : 0; // se 'ok' for false adiciona 1 no broken
            return stats;
        },
        {
            hrefList: new Set(), // set armazena valores únicos, não permitindo a sua duplicação
            broken: 0,
        }
    );
  
    return Promise.resolve({
        total: total, // número total de links
        unique: unique.size, // número de links únicos (size retorna o número de elementos únicos e não a inclusão de todos os elemento incluindo os duplicados)
        broken: broken, // número de links quebrado (não encontrado)
    });
};

// FUNÇÃO DE VALIDATE
function validateFunction(link) {
    return fetch(link.href)
        .then((objLink) => ({ ...link,
            status: objLink.status,
            ok: objLink.ok ? "ok" : "fail",
        }))
        .catch((error) => ({ ...link, 
            status: error,
            ok: "fail",
        }));
}

module.exports = {
    statsFunction,
    validateFunction
};
