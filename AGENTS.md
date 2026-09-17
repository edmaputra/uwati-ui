# Agent Guide: uwati-ui (medpulse-his)

Hospital Information System (HIS) frontend application built with Angular and Vite.

## Stack & Versions
- **Framework**: Angular 22+ (Standalone Components)
- **Language**: TypeScript (`strict: true`)
- **Styling**: TailwindCSS 4
- **Build Tool**: Vite 6 with AnalogJS Angular plugin
- **Standards**: Inherited from `.agents/rules/angular/` and `.agents/rules/shared/`

## Architecture: Feature-First Standalone
- `src/components/` -> Feature and UI components (Standalone, OnPush)
  - `auth/` -> Login portal and authentication flows
  - `dashboard/` -> Clinical overview dashboard and occupancy metrics
  - `patients/` -> Patient census, list, and detail modal
  - `triage/` -> Emergency / triage admission flow
  - `beds/` -> Bed matrix and ward allocation
  - `pharmacy/` -> Medication inventory and dispensing
  - `diagnostics/` -> Lab and radiology management
  - `layout/` -> Navigation bars, sidebar, and layout shell
  - `common/` -> Shared reusable clinical UI badges and widgets
- `src/services/` -> Reactive singleton services (`MedicalStateService`)
- `src/guards/` -> Route guards (`auth.guard.ts`)
- `src/data/` -> Clinical mock dataset (`mockData.ts`)

## Key Commands
- Dev Server: `npm run dev`
- Type Check / Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

## Agent Guidelines
- Check `.agents/project-structure.json` for component and store locations.
- If missing, run: `python3 .agents/scripts/scan-structure.py`.
- Strict rule: All components MUST be standalone with `ChangeDetectionStrategy.OnPush`.
- Strict rule: All commit messages must follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
