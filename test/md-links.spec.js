const fs = require('fs');
const fetch = require('node-fetch');
// const path = require('path');

const {
    readFile,
    readDir,
    read,
    validateLinks,
    getLinks,
    mdLinks
} = require('../src/index');

jest.mock('fs', () => ({
    promises: {
        readdir: jest.fn(),
        readFile: jest.fn(),
        stat: jest.fn()
    },
}));

const mockContent = 'qualquerstring';
const mockBuffer = {
    toString: jest.fn(() => mockContent),
};

fs.promises.readFile.mockResolvedValue(mockBuffer);

const mockFiles = ['arquivo.md', 'arquivo.txt', 'arquivo2.md'];
fs.promises.readdir.mockResolvedValue(mockFiles);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('readFile', () => {
    test('deve ler arquivo em .md', () => {
        const pathFile = './arquivoteste.md';
        const expectedResult = {
            file: pathFile,
            data: mockContent,
        };

        return readFile(pathFile).then((result) => {
            expect(result.file).toEqual(expectedResult.file);
            expect(result.data.toString()).toEqual(expectedResult.data);
            expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
            expect(fs.promises.readFile).toHaveBeenCalledWith(pathFile, 'utf8');
            expect(mockBuffer.toString).toHaveBeenCalledTimes(1);
        });
    });

    test('deve rejeitar com um erro para arquivo não .md', () => {
        return expect(readFile('./arquivonaomd.txt')).rejects.toThrow('O arquivo não é Markdown');
    });
});

describe('readDir', () => {
    test('deve ler o diretório e retornar os dados do arquivo markdown', () => {
        const pathDir = './diretorioteste';
        const expectedResult = [
            {
                file: expect.stringContaining('arquivo.md'),
                data: mockContent,
            },
            {
                file: expect.stringContaining('arquivo2.md'),
                data: mockContent,
            },
        ];

        return readDir(pathDir).then((result) => {
            result.forEach((item, index) => {
                expect(item.file).toEqual(expectedResult[index].file);
                expect(item.data.toString()).toEqual(expectedResult[index].data);
            });
            expect(fs.promises.readdir).toHaveBeenCalledTimes(1);
            expect(fs.promises.readdir).toHaveBeenCalledWith(pathDir);
            expect(fs.promises.readFile).toHaveBeenCalledTimes(2);
            expect(fs.promises.readFile).toHaveBeenCalledWith(expectedResult[0].file, 'utf8');
            expect(fs.promises.readFile).toHaveBeenCalledWith(expectedResult[1].file, 'utf8');
        });
    });
});

describe('read', () => {
    test('deve ler um diretório e chamar readDir', () => {
        const mockStat = {
            isDirectory: jest.fn(() => true),
        };
        fs.promises.stat.mockResolvedValueOnce(mockStat);
        const path = './diretorioteste';

        return read(path).then((result) => {
            result.forEach((item) => {
                expect(item.file).toEqual(expect.stringContaining('arquivo'));
                expect(item.data.toString()).toEqual(mockContent);
            });
            expect(fs.promises.stat).toHaveBeenCalledTimes(1);
            expect(fs.promises.stat).toHaveBeenCalledWith(path);
            expect(mockStat.isDirectory).toHaveBeenCalledTimes(1);
            expect(mockStat.isDirectory).toHaveBeenCalledWith(path);
        });
    });

    test('deve ler um arquivo e chamar readFile', () => {
        const mockStat = {
            isDirectory: jest.fn(() => false),
        };
        fs.promises.stat.mockResolvedValueOnce(mockStat);
        const path = './arquivoteste.md';

        return read(path).then((result) => {
            expect(result.file).toEqual(path);
            expect(result.data.toString()).toEqual(mockContent);
            expect(fs.promises.stat).toHaveBeenCalledTimes(1);
            expect(fs.promises.stat).toHaveBeenCalledWith(path);
            expect(mockStat.isDirectory).toHaveBeenCalledTimes(1);
            expect(mockStat.isDirectory).toHaveBeenCalledWith(path);
        });
    });
});

// TESTE - FUNÇÃO PARA VALIDAR LINKS
jest.mock('node-fetch');

describe('validateLinks', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('deve validar links e marcar como "ok" para links com status 200', () => {
        const link1 = { href: 'https://example.com', text: 'Example' };
        const link2 = { href: 'https://google.com', text: 'Google' };
        const arrayLinks = [link1, link2];

        fetch.mockResolvedValue({ status: 200, ok: true });

        const expectedResult = [
            { ...link1, status: 200, ok: 'ok' },
            { ...link2, status: 200, ok: 'ok' },
        ];

        return validateLinks(arrayLinks).then((result) => {
            expect(result).toEqual(expectedResult);
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenCalledWith('https://example.com');
            expect(fetch).toHaveBeenCalledWith('https://google.com');
        });
    });

    test('deve validar links e marcar como "fail" para links com status diferente de 200', () => {
        const link1 = { href: 'https://example.com', text: 'Example' };
        const link2 = { href: 'https://google.com', text: 'Google' };
        const arrayLinks = [link1, link2];

        fetch.mockResolvedValue({ status: 404, ok: false });

        const expectedResult = [
            { ...link1, status: 404, ok: 'fail' },
            { ...link2, status: 404, ok: 'fail' },
        ];

        return validateLinks(arrayLinks).then((result) => {
            expect(result).toEqual(expectedResult);
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenCalledWith('https://example.com');
            expect(fetch).toHaveBeenCalledWith('https://google.com');
        });
    });

    it('deve retornar um erro para links inválidos e marcá-los como "fail"', () => {
        const link1 = { href: 'https://example.com', text: 'Example' };
        const link2 = { href: 'https://google.com', text: 'Google' };
        const arrayLinks = [link1, link2];
    
        fetch.mockRejectedValue(new Error('Network Error'));
    
        const expectedResult = [
            { ...link1, status: 404, ok: false },
            { ...link2, status: 404, ok: false },
        ];
    
        return validateLinks(arrayLinks).then((result) => {
            expect(result).toEqual(expectedResult);
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenCalledWith('https://example.com');
            expect(fetch).toHaveBeenCalledWith('https://google.com');
        });
    });
});

// TESTE - FUNÇÃO PARA EXTRAIR OS DADOS DOS LINKS
describe('getLinks', () => {
    it('deve extrair dados dos links', () => {
        // Caso de teste com um link no texto
        const data1 = 'Este é um link: [Google](https://www.google.com)';
        const filePath1 = '/caminho/do/arquivo1.md';
        const expectedLinks1 = [
            {
                href: 'https://www.google.com',
                text: 'Google',
                file: filePath1,
            },
        ];
  
        // Caso de teste com múltiplos links no texto
        const data2 =
        'Aqui estão dois links: [Google](https://www.google.com) e [Facebook](https://www.facebook.com)';
        const filePath2 = '/caminho/do/arquivo2.md';
        const expectedLinks2 = [
            {
                href: 'https://www.google.com',
                text: 'Google',
                file: filePath2,
            },
            {
                href: 'https://www.facebook.com',
                text: 'Facebook',
                file: filePath2,
            },
        ];
  
        // Caso de teste com nenhum link no texto
        const data3 = 'Este texto não possui links.';
        const filePath3 = '/caminho/do/arquivo3.md';
        const expectedLinks3 = [];
  
        // Executa a função getLinks para cada caso de teste e verifica o resultado
        expect(getLinks(data1, filePath1)).toEqual(expectedLinks1);
        expect(getLinks(data2, filePath2)).toEqual(expectedLinks2);
        expect(getLinks(data3, filePath3)).toEqual(expectedLinks3);
    });
});

// TESTE - FUNÇÃO MDLINKS
describe('mdLinks', () => {
    test('deve retornar os links sem validação', () => {
        return mdLinks('arquivo.md').then((result) => {
            expect(result).toEqual({
                links: [{ href: 'https://example.com', text: 'link', file: 'example.md' }],
            });
        });
    });
  
    test('deve retornar os links com validação', () => {
        return mdLinks('arquivo.md', { validate: true }).then((result) => {
            expect(result).toEqual({
                links: [{ href: 'https://example.com', text: 'link', file: 'example.md', status: 200, statusText: 'OK' }],
            });
        });
    });
});
