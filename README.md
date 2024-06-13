# Projeto Angular

## Sumário
1. [Introdução](#introdução)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação](#instalação)
4. [Rodando o Projeto](#rodando-o-projeto)
5. [Estrutura do Projeto](#estrutura-do-projeto)

## Introdução

Este é um projeto Angular criado com Angular CLI 15 e Node.js 18. O objetivo deste documento é fornecer as instruções necessárias para clonar, instalar e executar o projeto localmente.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

- [Node.js](https://nodejs.org/) (versão 18.x)
- [Angular CLI](https://angular.io/cli) (versão 15.x)
- [Git](https://git-scm.com/)

## Instalação

Siga os passos abaixo para configurar o ambiente localmente:

## Clonar o Repositório

Clone o repositório do GitHub para o seu ambiente local usando o comando abaixo:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio/frontend
```

## Instalar Dependências

Depois de clonar o repositório, instale as dependências do projeto utilizando o npm:

```bash
npm install
```

## Rodando o Projeto

Para rodar o projeto localmente, utilize o comando abaixo:

```bash
ng s --o
```

Seu navegador ja vai abrir no projeto apos a finalização da compilação. Na primeiva vez pode demorar um pouco, mas nas proximas ja fica bem mais rapido. Caso você queira abrir na mão abra o seu navegador e navegue até http://localhost:4200/home. A aplicação será recarregada automaticamente se você alterar qualquer um dos arquivos de origem.

### Estrutura do Projeto

Uma breve descrição da estrutura dos arquivos e diretórios principais do projeto:

src/: Contém o código fonte da aplicação.
  app/: Contém os componentes, serviços e outros módulos da aplicação.
  assets/: Contém os arquivos estáticos como imagens e ícones.
  environments/: Contém os arquivos de configuração de ambiente.
angular.json: Arquivo de configuração do Angular CLI.
package.json: Contém as dependências e scripts do projeto.
README.md: Documentação do projeto.
