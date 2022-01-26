<h1 align="center">SkyDrinksUI</h1>

<p align="center">
    SkyDrinksUI é um site construido para uma empresa fictícia(Sky Drinks), desenvolvido com React e And Design.   
</p>

<p align="center">
    <img width="200" src="./SkyDrinksUI.png" />
</p>

Você pode visualizar o site já em produção na seguinte URL: https://thirsty-curie-dca26d.netlify.app/

O site pode demorar um pouco para carregar de inicio, porque o servidor deve estar iniciando. Caso as imagens das bebidas não estejam aparecendo, infelizmente o host do servidor deletou elas.

## :wrench: Como executar?

### :mag_right: Requisitos:

- NodeJS
- NPM ou Yarn.

Para rodar todas as funções do site, lembre-se de ter [o servidor](https://github.com/SkyG0D/sky-drinks-api) rodando na sua máquina.

### :athletic_shoe: Passo a passo:

1. Clone este repositório.
2. Abra uma nova janela no terminal e navegue até o diretório do projeto.
3. Execute `npm install` ou `yarn`.
4. Execute `npm start` ou `yarn start`.

O servidor rodará na porta 3000, e você poderá acessar pelo link `localhost:3000`.

### :paperclip: Informaçõea adicionais:

O arquivo `.env` na raiz do projeto precisa estar apontando para a URL [do servidor](https://github.com/SkyG0D/sky-drinks-api).

Exemplo:

```
REACT_APP_API_URL=http://localhost:8080/api/v1
```

## :rocket: Tecnologias usadas

- [React](https://pt-br.reactjs.org/) é uma biblioteca JavaScript de código aberto com foco em criar interfaces de usuário em páginas web.
- [Ant Design](https://ant.design/), biblioteca de estilos número 2 do react.
- [React Router](https://reactrouter.com/) é uma biblioteca para uso de rotas dinâmicas dentro da sua aplicação.
- [Sass](https://sass-lang.com/) é um preprocessador CSS.
- [ChartJS](https://www.chartjs.org/)
  é uma biblioteca para mostrar gráficos com JavaScript.
