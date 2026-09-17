# Agent Guide: uwati-ui

Hospital Information System (HIS) / Healthcare Administration frontend application built with Angular 22 and CoreUI.

## Stack & Versions
- **Framework**: Angular 22+ (Standalone Components)
- **Language**: TypeScript (`strict: true`)
- **UI Library**: CoreUI Angular 5.7+ (`@coreui/angular`)
- **Styling**: SCSS
- **Build Tool**: Angular CLI 22 (`@angular/build`)
- **Standards**: Inherited from `.agents/rules/angular/` and `.agents/rules/shared/`

## Architecture: Feature-First Standalone
- `src/app/core/` -> Core business logic & foundation
  - `guards/` -> Route guards (`auth.guard.ts`)
  - `interceptors/` -> HTTP interceptors (`auth.interceptor.ts`)
  - `models/` -> Core domain models (Auth, Facility, IAM, ServiceUnit, Tenancy)
  - `services/` -> API services (Auth, Facility, IAM, ServiceUnit, Tenant)
- `src/app/layout/` -> Shell layouts
  - `default-layout/` -> Header, footer, sidebar navigation (`_nav.ts`)
- `src/app/views/` -> Feature views & routed pages
  - `authentication/` -> Login, registration, password recovery flows
  - `dashboard/` -> Analytics overview, brand widgets, charts
  - `iam/` -> Users, roles, groups, and scopes management
  - `organization/` -> Facilities and service units administration
  - `tenancy/` -> Multi-tenant settings and management
  - `error-pages/` -> 404, 500 error pages
- `src/app/icons/` -> CoreUI icon subset definitions

## Key Commands
- Dev Server: `npm start`
- Build: `npm run build`
- Test: `npm test`

## Agent Guidelines
- Check `.agents/project-structure.json` for component and store locations.
- If missing, run: `python3 .agents/scripts/scan-structure.py`.
- Strict rule: All components MUST be standalone with `ChangeDetectionStrategy.OnPush`.
- Strict rule: All commit messages must follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

