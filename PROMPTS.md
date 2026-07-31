Prompt 1 - Criação do Projeto:

Objetivo:
Criar APIs Rest para um CRUD de Motocicletas.

Contexto:
As Apis possuem as seguintes funcionalidades, registro de motos, busca de motos e dados das motos, delete de motos, edição de dados de motos.
- Para que eu possa usar as funcionalidades, preciso fazer login como gerente acessa todas as funcionalidades do sistema CRUD,
- Login com usuário comum tem acesso apenas a consulta de motos
  
Regras: 
- Não me pergunte nada, só faça.
- A documentação das APIs devem ser feitas com SWAGGER, em forma de arquivo. Crie esse arquivo em uma pasta de recursos.
- O swagger precisa descrever o modelo json da resposta de cada endpoint com base na forma que a API for implementada.
- O swagger também deve contemplar os status code de erro que são implementadas nas APIs.
- Adicione um endpoint para rendezirar o swagger.
- Construa um arquivo README para descrever o projeto.
- Divida a API em camadas: routs, controllers, service e models.
- Armazenae os dados da API em um banco de dados em memória.
- Utilize a biblioteca express para construir a API Rest.