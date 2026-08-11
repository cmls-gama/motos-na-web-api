# API REST de Motocicletas

API de portfólio para gerenciar motocicletas, construída com Node.js e Express. O projeto oferece um CRUD protegido por JWT, autorização por perfil, armazenamento em memória e documentação OpenAPI/Swagger.

## Funcionalidades

- Login com emissão de token JWT.
- Perfil `manager`: cria, consulta, edita e remove motocicletas.
- Perfil `user`: consulta a lista e os detalhes de motocicletas.
- Validação dos dados recebidos e erros no formato `{ "error": "mensagem" }`.
- Banco em memória com `Map` (os dados são apagados ao reiniciar a aplicação).
- Swagger UI em `/api-docs` e contrato OpenAPI em `/api-docs.json`.

## Pré-requisitos

- Node.js 18 ou superior.
- npm.

## Instalação e execução

```bash
npm install
```

Copie `.env.example` para `.env` e substitua, principalmente, `JWT_SECRET` por uma chave longa e aleatória. No PowerShell:

```powershell
Copy-Item .env.example .env
```

Inicie a API:

```bash
npm start
```

Para executar com recarga automática durante o desenvolvimento:

```bash
npm run dev
```

A API estará em `http://localhost:3000` e o Swagger em `http://localhost:3000/api-docs`.

## Autenticação

Por padrão, o `.env.example` contém duas contas locais para demonstração:

| Perfil | Usuário | Senha | Permissão |
| --- | --- | --- | --- |
| Gerente | `gerente` | `gerente123` | CRUD completo |
| Comum | `usuario` | `usuario123` | Apenas GET |

Faça login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"gerente","password":"gerente123"}'
```

A resposta contém `token` e os dados públicos do usuário:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "username": "gerente",
    "role": "manager"
  }
}
```

Envie o token nas rotas de motocicletas usando o cabeçalho `Authorization: Bearer <token>`.

## Endpoints

| Método | Endpoint | Perfil |
| --- | --- | --- |
| POST | `/api/auth/login` | Público |
| GET | `/api/motorcycles` | Gerente ou comum |
| GET | `/api/motorcycles/:id` | Gerente ou comum |
| POST | `/api/motorcycles` | Gerente |
| PUT | `/api/motorcycles/:id` | Gerente |
| DELETE | `/api/motorcycles/:id` | Gerente |
| GET | `/health` | Público |
| GET | `/api-docs` | Público |
| GET | `/api-docs.json` | Público |

Exemplo de criação:

```json
{
  "brand": "Honda",
  "model": "CB 500F",
  "year": 2025,
  "color": "Vermelha",
  "engineCapacityCc": 471
}
```

A criação e as consultas unitárias respondem com `{ "data": { ... } }`. A listagem responde com `{ "data": [...], "count": 1 }`. A remoção bem-sucedida retorna `204` sem corpo.

## Estrutura do projeto

```text
.github/
  workflows/
    main.yml                     # Pipeline de integração contínua no GitHub Actions
resources/
  openapi.json                 # Contrato OpenAPI 3.0
src/
  config/                      # Usuários locais e derivação de senhas
  controllers/                 # Entrada HTTP e formatação das respostas
  middlewares/                 # JWT, autorização e tratamento de erros
  models/                      # Entidade e armazenamento em memória
  routes/                      # Definição dos endpoints
  services/                    # Regras de negócio e validações
  app.js                       # Configuração do Express
  server.js                    # Inicialização do servidor
test/
  api.test.js                  # Testes de integração
```

## Testes

```bash
npm test
```

Os testes cobrem login, token ausente/inválido, permissões dos perfis, CRUD, validação e disponibilidade do Swagger.

## Integração contínua com GitHub Actions

O projeto possui um fluxo de integração contínua (CI) configurado no arquivo [`.github/workflows/main.yml`](.github/workflows/main.yml). O objetivo do workflow `Motos-na-Web-API-CI` é validar automaticamente a API e reduzir o risco de integrar alterações que quebrem os comportamentos cobertos pelos testes.

A CI é executada nas seguintes situações:

- manualmente, pela opção **Run workflow** na aba **Actions** do GitHub;
- na criação ou atualização de um pull request destinado à branch `main`;
- após um push na branch `main`, incluindo o commit gerado pelo merge de um pull request.

Cada execução utiliza um runner Linux com Ubuntu e possui limite de 10 minutos. O fluxo realiza estas etapas:

1. clona o código do repositório;
2. configura o Node.js 24 e o cache do npm;
3. instala exatamente as dependências registradas no `package-lock.json` com `npm ci`;
4. inicia a API em segundo plano na porta `3000`;
5. consulta o endpoint `/health` até confirmar que a aplicação está disponível;
6. executa a suíte automatizada com `npm test`;
7. publica o relatório do Mochawesome e o log do servidor como o artefato `relatorio-mochawesome`, mantido por 7 dias.

As variáveis necessárias para a API e para os testes são definidas no próprio job de CI. A chave JWT usada nesse ambiente é exclusiva para testes e não deve ser utilizada em produção. Se a API não iniciar ou qualquer teste falhar, o job será marcado como falho. Mesmo nessa situação, a etapa de publicação utiliza `if: always()` para preservar os relatórios e facilitar a investigação.

Execuções anteriores e seus artefatos podem ser consultados na aba **Actions** do repositório no GitHub. Quando uma nova execução é iniciada para a mesma referência, a anterior ainda em andamento é cancelada para evitar processamento duplicado.

## Segurança e configuração

- As senhas são derivadas com `scrypt` e comparadas em tempo constante durante a execução.
- O cabeçalho `X-Powered-By` do Express é desabilitado.
- O corpo JSON é limitado a 100 KB.
- Use credenciais próprias e uma chave JWT forte fora do ambiente local.
- O fallback de credenciais e chave existe apenas para facilitar a demonstração; em produção, configure todas as variáveis do `.env.example` por meio seguro.
