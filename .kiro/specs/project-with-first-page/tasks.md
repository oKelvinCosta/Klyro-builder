# Implementation Plan

- [x] 1. Update `getProjectById` in `projectController.ts`





  - Import the `Page` model at the top of the file
  - Replace the single `Project.findById` call with `Promise.all([Project.findById, Page.findOne(...).sort({ order: 1 }).limit(1)])` 
  - Return `{ project, firstPage }` instead of the bare project document
  - Add a comment marking where `.limit(1)` can be removed (or the query extracted) to support full page loading
  - Handle the case where `project` is null (404) before returning the combined response
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1, 3.2_

- [x] 2. Create `projectRoutes.ts`





  - Create `backend/src/routes/projectRoutes.ts` mirroring the structure of `pageRoutes.ts`
  - Import and wire all existing exports from `projectController.ts` (`createProject`, `getProjectsByUserId`, `getUngroupedProjectsByUserId`, `getProjectsByGroupId`, `getProjectById`, `updateProject`, `deleteProject`)
  - _Requirements: (supports delivery of Requirement 1 and 2 via HTTP)_

- [x] 3. Register `/projects` route in `server.ts`








  - Import `projectRoutes` in `server.ts`
  - Add `app.use('/projects', projectRoutes)` alongside the existing route registrations
  - _Requirements: (supports delivery of Requirement 1 and 2 via HTTP)_
