const fs = require('fs');
const path = require('path');

const { readDir, readFile } = require('../src/index');

// const mdLinks = require('../src/md-links');

jest.mock('fs', () => ({
    promises: {
        readdir: jest.fn(),
        readFile: jest.fn(),
        stat: jest.fn()
    }
}));

const mdContentMap = {
    './src/file/file1.md': 'Conteúdo do arquivo ./src/file/file1.md',
    './src/file/file2.md': 'Conteúdo do arquivo ./src/file/file2.md',
};
  
describe('index.js', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
  
    test('Deve retornar um array com os dados do diretório .md', () => {
        const expectedFiles = [
            { file: path.resolve('./src/file/file1.md'), data: mdContentMap['./src/file/file1.md'] },
            { file: path.resolve('./src/file/file2.md'), data: mdContentMap['./src/file/file2.md'] },
        ];
    
        fs.promises.readdir.mockResolvedValue(['file1.md', 'file2.md', 'file3.txt']);
        fs.promises.readFile
            .mockResolvedValueOnce(mdContentMap['./src/file/file1.md'])
            .mockResolvedValueOnce(mdContentMap['./src/file/file2.md']);
    
        return readDir('./src/file').then((result) => {
            expect(result).toEqual(expectedFiles);
            expect(fs.promises.readdir).toHaveBeenCalledWith('./src/file');
            expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
            expect(fs.promises.readFile).toHaveBeenCalledWith('./src/file/file1.md', 'utf-8');
            expect(fs.promises.readFile).toHaveBeenCalledWith('./src/file/file2.md', 'utf-8');
        });
    });
  
    test('deve ler e retornar o conteúdo de um arquivo .md', () => {
        const file = 'caminho-do-arquivo/arquivo.md';
        const fileContent = 'Conteúdo do arquivo Markdown';
  
        fs.promises.readFile.mockResolvedValueOnce(fileContent);
  
        return readFile(file).then((result) => {
            expect(fs.promises.readFile).toHaveBeenCalledWith(file);
            expect(result).toEqual({
                file: file,
                data: fileContent,
            });
        });
    });
  
    test('deve rejeitar a promessa se o arquivo não for .md', () => {
        const file = 'caminho-do-arquivo/arquivo.txt';
  
        return expect(readFile(file)).rejects.toThrowError('Error: O arquivo não é Markdown');
    });

});



/* describe('fileSystem', () => {
    test('deve ler diretório', () => {
        expect.assertions(1);
        return readDir().then((pathDir) => {
            expect(pathDir).toEqual('leu');
        });
    });
}); */

/* describe('mdLinks', () => {

    test('should...', () => {
        console.log('OLHA EU AQUIII HAHAAH!');
    });

});*/
