# Markdown Links

## Resumo do projeto

Neste projeto, foi desenvolvido uma ferramenta de **linha de comando (CLI)** assim como uma biblioteca (library) em Javascript para **Análise de Links em Arquivos Markdown**. Um projeto **Back-end** onde foi utilizado as tecnologias Node.js, para o desenvolvimento do código, e o Jest, para execusão dos testes unitários. 

O propósito fundamental dessa biblioteca é possibilitar a leitura de arquivos no formato Markdown, localizados na máquina do usuário, e realizar uma análise da presença de links nesses documentos. A flexibilidade da biblioteca permite não somente a **identificação de links**, mas também a **verificação de sua validade e a obtenção de estatísticas sobre cada um deles**.

Para uma melhor visualização das informações no terminal, foi feita uma estilização da CLI utilizando o chalk-cli e cli-table3.

## Objetivos de aprendizagem
- JavaScript
- Node.js
- HTTP
- Controle de Versões (Git e GitHub)

## Considerações gerais

### 1. Instalação
O módulo pode ser **instalado** com o seguinte comando: 
```sh
$ npm install myllenammartins-md-links
```

### 2. CLI (Command Line Interface - Interface de Linha de Comando)
##
### Pré-requisitos:
- Instalação do Node.js com versão >=16;
- Instalação do gitbash para utiliza-lo como ambiente de execução;
##
Pode ser executado da seguinte maneira,
através do **terminal**:

`md-links <path-to-file> [options]`

Deve identificar o arquivo Markdown (a partir da rota que recebeu como
argumento), analisar o arquivo Markdown e imprimir os links que vão sendo
encontrados, junto com a rota do arquivo onde aparece e o texto encontrado
dentro do link (truncado 50 caracteres).

Por exemplo:

<div align="center">
 <img alt="path" width="400" src="https://user-images.githubusercontent.com/99662544/256058839-466c82e2-81a9-4ac8-83c6-ce55c7e18aac.png"/><br>
</div>

#### Options

##### `--validate`

Se passamos a opção `--validate`, o módulo deve fazer uma requisição HTTP para
verificar se o link funciona ou não. Se o link resultar em um redirecionamento a
uma URL que responde ok, então consideraremos o link como ok.

Por exemplo:

<div align="center">
 <img alt="validate" width="500" src="https://user-images.githubusercontent.com/99662544/256056584-2bbe34c8-b84f-4e13-9864-39aee8de481e.png"/><br>
</div>

Vemos que o _output_ neste caso inclui a palavra `ok` e `fail` depois da URL,
assim como o status da resposta recebida à requisição HTTP feita pela URL.

##### `--stats`

Se passamos a opção `--stats` o output (saída) será um texto com estatísticas
básicas sobre os links.

<div align="center">
 <img alt="stats" width="500" src="https://user-images.githubusercontent.com/99662544/256056498-5d3a9e8d-200c-4472-bc10-25af6f112fc7.png"/><br>
</div>

Também podemos combinar `--stats` e `--validate` para obter estatísticas que
necessitem dos resultados da validação.

<div align="center">
 <img alt="statsAndValidate" width="500" src="https://user-images.githubusercontent.com/99662544/256056384-79fb7279-ca58-49c4-b15d-94161f5a1780.png"/><br>
</div>


## Fluxograma
Para aprimorar a visualização do planejamento de tarefas e objetivos a serem alcançados, a organização do projeto foi representada por meio de um fluxograma, conforme ilustrado abaixo:

<div align="center">
 <img alt="Fluxograma" width="550" src="https://user-images.githubusercontent.com/99662544/255694008-0443b6e6-655a-4444-99e3-aa98c34b89b2.png"/><br>
</div>

***
<div align="center">
  <br>
  <img align="center" alt="Jest" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" /> 
  <img align="center" alt="git" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" />
  <img align="center" alt="Javascript" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg">
  <img  align="center" alt="Node" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
  <br>
  <br>

</div>
 
***
