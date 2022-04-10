#### Configuração do projeto

- Criar o projeto backend compras (purchases)

```js
  nest new purchases
```

- Criar o projeto backend sala de aulas (classroom)

```js
  nest new classroom
```

- Criar o front-end em next

```js
yarn create next-app --typescript
```

> controllers: são as rotas da aplicação.
> providers: arquivos que possuem algum tipo de funcionalidade.
>
> - controllers (rotas) chamam os serviços de nossa aplicação, onde está a regra de negócio.

- Rodar o servidor de desenvolvimento nest

```js
yarn start:dev
```

#### Entendendo o arquivo controller.

- Indicamos que a classe é um controller utilizando o decorator, assim como indicamos também através de decorators os métodos deste controller como no exemplo abaixo o método GET.

```js
@Controller()
export  class  AppController {
constructor(private  readonly  appService:  AppService) {}
@Get()
getHello():  string {
return  this.appService.getHello();
}

@Get('/batata')
getBatata():  string {
return  'Hello Batata';
	}
}
```
