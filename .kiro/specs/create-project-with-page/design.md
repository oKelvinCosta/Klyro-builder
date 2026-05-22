# Design Document

## Overview

A mudança é cirúrgica: o `createProject` no `projectController.ts` precisa criar uma `Page` logo após criar o `Project`, dentro da mesma operação atômica. Se qualquer etapa falhar, o estado do banco deve ser revertido. A resposta da rota passa a retornar `{ project, page }` em vez de apenas o projeto.

## Architecture

A lógica fica inteiramente no controller existente (`projectController.ts`). Não há necessidade de um service separado dado o escopo pequeno da mudança. O fluxo é sequencial:

```mermaid
sequenceDiagram
    Client->>POST /projects: { title, slug, version, userId, ... }
    POST /projects->>createProject(): body
    createProject()->>Project.create(): body
    Project.create()-->>createProject(): project
    createProject()->>Page.create(): { projectId, slug, order, puckData }
    alt Page.create falha
        createProject()->>Project.findByIdAndDelete(): project._id
        createProject()-->>Client: 500 { error }
    else Sucesso
        createProject()-->>Client: 201 { project, page }
    end
```

## Components and Interfaces

### `createProject` (modificado)

Localização: `backend/src/controllers/projectController.ts`

Fluxo atualizado:
1. Recebe o body, normaliza `groupId`.
2. Cria o `Project`.
3. Monta o payload da `Page` inicial usando `projectId` do projeto criado.
4. Cria a `Page`.
5. Se a criação da `Page` lançar erro, deleta o projeto e retorna 500.
6. Retorna `201` com `{ project, page }`.

### Payload da Page inicial

| Campo | Valor |
|---|---|
| `projectId` | `project._id` |
| `title` | `'Página Klyro'` (default do schema) |
| `slug` | `${project.slug}-page-1` |
| `order` | `1` |
| `puckData` | `{}` |
| `type` | `'landing'` (default do schema) |

## Data Models

Nenhum schema é alterado. Os modelos `Project` e `Page` existentes já suportam o relacionamento via `projectId`.

## Error Handling

| Cenário | Comportamento |
|---|---|
| `Project.create` falha | Retorna 500, nenhuma `Page` é criada |
| `Page.create` falha após projeto criado | Deleta o projeto com `findByIdAndDelete`, retorna 500 |
| Body inválido (ex: sem `slug`) | Mongoose lança `ValidationError`, retorna 500 com a mensagem |

O rollback manual com `findByIdAndDelete` é suficiente aqui. Uma transação MongoDB seria mais robusta, mas exige replica set configurado — o rollback manual é a abordagem pragmática para o ambiente atual.

## Testing Strategy

Testar via Postman:

**Request:**
- Method: `POST`
- URL: `http://localhost:<porta>/projects`
- Body (JSON):
```json
{
  "title": "Meu Projeto",
  "slug": "meu-projeto",
  "version": 1,
  "userId": "<ObjectId válido>"
}
```

**Resposta esperada (201):**
```json
{
  "project": {
    "_id": "...",
    "title": "Meu Projeto",
    "slug": "meu-projeto",
    ...
  },
  "page": {
    "_id": "...",
    "slug": "meu-projeto-page-1",
    "order": 1,
    "projectId": "...",
    "puckData": {},
    ...
  }
}
```
