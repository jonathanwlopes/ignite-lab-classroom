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

#### Setup autenticação backend

- Primeiramente realizar o desacoplamento dos modulos de nossa aplicação, iniciando pelo banco de dados.

```ts
nest generate module database
```

- Agora desacoplamos o modulo de http, requisições, graphql, rotas.

```ts
nest generate module http
```

> Mais pra frente podemos ter mais módulos em nossa aplicação e devemos
> realizar o desacoplamento.

###### **Importante lembrar de cadastrar os arquivos .env no .gitignore.**

- Para o nest entender os arquivos .env, devemos instalar o @nestjs/config

```ts
yarn add @nestjs/config
```

- Após instalar o nest/config, devemos chamar a configuração onde vamos utilizar, neste caso vamos utilizar no modulo de http, então importamos o ConfigModule do nest no modulo de http, desta forma o modulo http irá dar acesso as variáveis ambiente (process.env).

```ts
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
@Module({
  imports: [ConfigModule.forRoot()],
})
export class HttpModule {}
```

- Para configuração do auth0, vamos precisar de duas variáveis são elas: AUTH0_AUDIENCE, AUTH0_DOMAIN

- Agora vamos criar a nossa autenticação, para gerar este arquivo devemos utilizar o comando

```ts
nest generate guard authorization --no-spec
```

- O arquivo gerado deve ser inserido na pasta do modulo de http, e para ficar mais organizado dentro de uma pasta chama auth, isso é feito pois a nossa autentização será gerada nas requisições http.
- Não vamos utilizar observable, podemos remove do arquivo de authorization, e também o retorno do nosso método canAtivate será apenas uma Promise`<boolean>`
- O guard que geramos é um **middleware** e ele vai basicamente definir se o usuário pode prosseguir com a requisição ou não.

- A configuração do guard pode ser seguida utilizando o proprio exemplo do auth0, na aba de APIS o exemplo em nodejs, para configuração do JWT.

- Temos também a configuração realizada em aula, onde utilizamos promosify, e uma linguaguem atual.

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import jwt from "express-jwt"
import { expressJwtSecret } from "jwks-rsa"
import { promisify } from "node:util"
@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string
  private AUTH0_DOMAIN: string
  constructor(private configService: ConfigService) {
    this.AUTH0_AUDIENCE = this.configService.get("AUTH0_AUDIENCE") ?? ""
    this.AUTH0_DOMAIN = this.configService.get("AUTH0_DOMAIN") ?? ""
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp()
    const req = httpContext.getRequest()
    const res = httpContext.getResponse()
    const checkJWT = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ["RS256"],
      })
    )
    try {
      await checkJWT(req, res)
      return true
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
```

- Dessa forma nosso middware está pronto para determinar se o usuário pode ou não acessar a nossa aplicação.

#### Setup autenticação front-end

- Dentro do auth0, cada frontend é uma application.
- Configurar as variáveis de ambiente, constantes no tutorial do auth0.
- Configurar a rota /api/auth/[...auth0].ts
- Configurar na home uma página de teste de login.

```ts
import { getAccessToken, useUser } from "@auth0/nextjs-auth0"
import type { GetServerSideProps, NextPage } from "next"

const Home: NextPage = () => {
  const { user } = useUser()
  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <a href="/api/auth/login">Login</a>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getAccessToken(req, res)
  console.log(token)
  return {
    props: {},
  }
}
```

- Após receber o token, podemos bater na api do auth0 para receber as informações do usuário. (Insominia)

```ts
//dev-571uoekj.us.auth0.com/userinfo
https: Bearer: "token"
```

- Para fins de testes, vamos criar na nossa aplicação backend um controller.

```ts
nest generate controller test --no-spec
```

Possível erro: TypeError: (0 , express_jwt_1.default) is not a function
Solução: ts.config adicionamos: "esModuleInterop": true (permite import default)

#### Configurando banco de dados (prisma/mongodb)

```ts
 yarn add -D prisma
 yarn prisma init
 nest generate service prisma //export in database, import in http.module
```
