# Requirements Document

## Introduction

Ao criar um projeto, o sistema deve automaticamente criar uma Page inicial vinculada a ele. Atualmente, `createProject` apenas persiste o `Project` sem criar nenhuma `Page` associada. Essa feature garante que todo projeto sempre tenha ao menos uma página padrão ao ser criado, mantendo a consistência dos dados e evitando que `getProjectById` retorne `firstPage: null` para projetos recém-criados.

## Requirements

### Requirement 1

**User Story:** Como desenvolvedor consumindo a API, quero que ao criar um projeto uma página inicial seja criada automaticamente, para que o projeto já esteja pronto para uso sem precisar de uma chamada extra.

#### Acceptance Criteria

1. WHEN uma requisição `POST /projects` é feita com dados válidos THEN o sistema SHALL criar o `Project` e, em seguida, criar uma `Page` vinculada ao `projectId` do projeto recém-criado.
2. WHEN a `Page` inicial é criada automaticamente THEN o sistema SHALL definir `order: 1`, `slug` derivado do slug do projeto, `puckData` com um objeto vazio padrão `{}`, e `title` com o valor padrão `'Página Klyro'`.
3. WHEN a criação do `Project` falha THEN o sistema SHALL retornar erro e NÃO SHALL criar nenhuma `Page`.
4. WHEN a criação da `Page` falha após o `Project` ter sido criado THEN o sistema SHALL fazer rollback (deletar o projeto criado) e retornar status `500` com a mensagem de erro.

### Requirement 2

**User Story:** Como desenvolvedor, quero que a resposta do `POST /projects` inclua o projeto e a página criada, para que eu possa usar os dados imediatamente sem fazer outra requisição.

#### Acceptance Criteria

1. WHEN o `POST /projects` é bem-sucedido THEN o sistema SHALL retornar status `201` com um objeto contendo `{ project, page }`.
2. WHEN o `POST /projects` retorna a resposta THEN o objeto `page` SHALL conter pelo menos `_id`, `slug`, `order`, `projectId` e `puckData`.

### Requirement 3

**User Story:** Como desenvolvedor, quero que o `slug` da página inicial seja gerado de forma consistente a partir do slug do projeto, para que as rotas sejam previsíveis.

#### Acceptance Criteria

1. WHEN o projeto tem `slug: "meu-projeto"` THEN a página inicial SHALL ter `slug: "meu-projeto-page-1"` ou equivalente derivado.
2. WHEN o campo `slug` não é fornecido no body da requisição THEN o sistema SHALL retornar erro de validação (o slug do projeto é `required`).
