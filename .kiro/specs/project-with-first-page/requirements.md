# Requirements Document

## Introduction

When fetching a project by ID, the response should also include the first page associated with that project — specifically the page with the lowest `order` value. This avoids loading all pages upfront (no pagination needed yet), while keeping the architecture ready to support full page listing in the future with minimal changes.

## Requirements

### Requirement 1 — Fetch first page alongside project

**User Story:** As a frontend consumer, I want the `GET /projects/:id` endpoint to return the project data along with its first page (lowest `order`), so that I can render the initial content without a second request.

#### Acceptance Criteria

1. WHEN a valid project ID is requested THEN the system SHALL return the project document AND the page with the lowest `order` value for that project.
2. WHEN the project has no associated pages THEN the system SHALL return the project document with `firstPage` set to `null`.
3. WHEN the project does not exist THEN the system SHALL return a 404 error.
4. WHEN fetching the first page THEN the system SHALL use the existing `{ projectId: 1, order: 1 }` compound index for performance.

### Requirement 2 — Structured response shape

**User Story:** As a frontend developer, I want a predictable response shape from `GET /projects/:id`, so that I can reliably destructure the project and its first page.

#### Acceptance Criteria

1. WHEN the endpoint returns successfully THEN the response SHALL have the shape `{ project: {...}, firstPage: {...} | null }`.
2. WHEN `firstPage` is present THEN it SHALL include all fields of the Page document (`_id`, `title`, `order`, `puckData`, `projectId`, `createdAt`, `updatedAt`).

### Requirement 3 — Scalable foundation for full page loading

**User Story:** As a developer, I want the implementation to be structured so that loading all pages for a project can be added later with minimal effort, so that pagination or full-load features can be introduced without refactoring.

#### Acceptance Criteria

1. WHEN the first-page query is implemented THEN the system SHALL isolate the page-fetching logic in a way that can be extended to return all pages (e.g., removing `.limit(1)` or extracting to a service).
2. WHEN the code is written THEN it SHALL include a comment indicating where and how to extend for full page loading.
