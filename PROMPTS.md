Prompt 1 - Criação do Projeto:

# Prompt para Codex — API REST de Motocicletas

## Objetivo
Criar uma API REST em Node.js para um CRUD de Motocicletas, como projeto de portfólio pessoal, seguindo boas práticas de arquitetura, segurança e documentação.

## Contexto do domínio
A API gerencia motocicletas com as seguintes operações:
- Registro (criação) de motos
- Busca de motos (listagem e por ID)
- Edição de dados de motos
- Remoção (delete) de motos

### Regras de autenticação e autorização
- Autenticação via login, retornando um token JWT.
- Existem dois perfis de usuário:
  - **Gerente**: acesso completo a todas as funcionalidades do CRUD (criar, ler, atualizar, deletar).
  - **Usuário comum**: acesso apenas às operações de consulta (leitura/busca de motos).
- A validação do token e das permissões deve ser feita em um **middleware de autenticação/autorização**, aplicado às rotas antes de chegar ao controller.

## Requisitos técnicos

### Stack
- Node.js + Express para construção da API REST.
- Banco de dados em memória (ex.: array/objeto em módulo Node, ou lib como `lowdb`/`node-cache` — decida a mais simples e adequada).
- JWT para autenticação (ex.: lib `jsonwebtoken`).

### Arquitetura em camadas
Organize o projeto separando claramente:
- **routes**: definição dos endpoints e associação com middlewares/controllers.
- **controllers**: recebem a requisição, chamam o service e formatam a resposta.
- **services**: contêm a lógica de negócio.
- **models**: representam a entidade Moto e a estrutura de dados em memória.
- **middlewares**: autenticação JWT e verificação de perfil (gerente/usuário comum).

### Documentação (Swagger)
- Documentar todas as APIs usando Swagger (OpenAPI), em um **arquivo separado** dentro de uma pasta de recursos (ex.: `/resources` ou `/docs`).
- O Swagger deve descrever:
  - O modelo JSON de resposta de cada endpoint, refletindo fielmente o que a API implementada retorna.
  - Os status codes de sucesso e de erro implementados em cada endpoint (ex.: 200, 201, 400, 401, 403, 404, 500).
- Criar um endpoint específico para renderizar a interface do Swagger (ex.: `/api-docs`).

### Outros entregáveis
- Arquivo **README.md** na raiz do projeto, descrevendo:
  - O propósito do projeto.
  - Como instalar e rodar a aplicação.
  - Como autenticar (login) e usar o token JWT nas requisições.
  - Onde acessar a documentação Swagger.
  - Estrutura de pastas do projeto.

## Critérios de aceite
- Endpoints de moto respeitam as permissões: usuário comum só acessa GET; gerente acessa todos os métodos.
- Tentativas de acesso sem token ou com token inválido retornam 401.
- Tentativas de usuário comum em endpoints restritos a gerente retornam 403.
- Toda resposta de erro segue um formato JSON consistente (ex.: `{ "error": "mensagem" }`).
- Swagger acessível via navegador e condizente com o comportamento real da API.

## Regras de execução para o Codex
- Não fazer perguntas — implementar diretamente com base neste prompt.
- Seguir a arquitetura em camadas descrita acima.
- Gerar todos os arquivos necessários (rotas, controllers, services, models, middlewares, swagger, README).