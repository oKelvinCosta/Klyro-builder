# Implementation Plan

- [ ] 1. Atualizar `createProject` para criar a Page inicial
  - Após `Project.create(body)`, montar o payload da page com `projectId: project._id`, `slug: \`${project.slug}-page-1\``, `order: 1` e `puckData: {}`
  - Envolver `Page.create(...)` em try/catch: se falhar, chamar `Project.findByIdAndDelete(project._id)` e retornar status 500
  - Alterar o retorno de sucesso para `res.status(201).json({ project, page })`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1_

- [ ] 2. Escrever testes para o fluxo de criação
  - [ ] 2.1 Testar criação bem-sucedida: verificar que a resposta contém `project` e `page` com os campos corretos (`slug`, `order`, `projectId`, `puckData`)
    - _Requirements: 2.1, 2.2, 3.1_
  - [ ] 2.2 Testar rollback: mockar `Page.create` para lançar erro e verificar que o projeto é deletado e o status retornado é 500
    - _Requirements: 1.4_
