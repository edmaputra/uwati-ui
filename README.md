# Uwati HIS Frontend

[![Angular](https://img.shields.io/badge/Angular-22.1.5-dd0031.svg?style=flat-square&logo=angular)](https://angular.dev/)
[![CoreUI](https://img.shields.io/badge/CoreUI-5.7-321fdb.svg?style=flat-square&logo=coreui)](https://coreui.io/angular/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Modern, responsive Hospital Information System (HIS) web administration portal built with **Angular 22** and the **CoreUI Admin Template**. This frontend interfaces directly with the **Uwati** multi-tenant hexagonal backend services and the **ed-iam-starter** security module.

---

## Table of Contents

- [Overview](#overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Key Features](#key-features)
  - [Authentication & Session](#authentication--session)
  - [Dashboard](#dashboard)
  - [Organization Management](#organization-management)
  - [Multi-Tenancy Management](#multi-tenancy-management)
  - [Identity & Access Management (IAM)](#identity--access-management-iam)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Backend Integration & API Routing](#backend-integration--api-routing)
- [License](#license)

---

## Overview

**Uwati HIS Frontend** provides healthcare administrators, facility directors, and platform operators with an intuitive interface to manage healthcare facilities, clinical service units, multi-tenant environments, and identity access policies.

Designed for high-performance and modern web standards, it uses **Zoneless change detection** introduced in modern Angular and integrates with Uwati's multi-tenant header propagation mechanism (`X-Tenant-Id`).

---

## Architecture & Tech Stack

- **Framework**: [Angular 22](https://angular.dev/)
- **Change Detection**: Zoneless (`provideZonelessChangeDetection()`) for optimal performance and smaller bundle size.
- **UI Framework & Components**: [@coreui/angular](https://coreui.io/angular/) (v5.7) with Bootstrap 5 and CoreUI Icons (`@coreui/icons`).
- **Styling**: SCSS with CoreUI design system and responsive layout grid.
- **Data & Reactive Programming**: [RxJS](https://rxjs.dev/) for asynchronous event streams and reactive state.
- **HTTP & Interceptors**:
  - `AuthInterceptor`: Automatically injects `Authorization: Bearer <jwt>`, `X-Tenant-Id`, and distributed tracing `X-Correlation-Id` into all outgoing backend requests.
  - `AuthGuard`: Secures routes against unauthenticated access and redirects to `/login`.

---

## Key Features

### Authentication & Session
- **JWT Login**: Direct integration with `POST /api/v1/auth/login`.
- **Session Persistence**: Stores authentication tokens and active tenant context in `localStorage`.
- **Header Tenant Switcher**: Fast modal switcher in the main navigation bar allowing platform operators to switch active tenant scopes on the fly.
- **Auto-Logout & Route Guards**: Redirects unauthenticated requests to the login screen and preserves navigation state.

### Dashboard
- **Operational Summary Cards**: High-level overview of active healthcare facilities, service units, registered users, and active tenants.
- **Active Tenant Context Badge**: Real-time indication of current tenant scope and operational status.
- **Quick Links**: Direct shortcuts to facility registration, user provisioning, and tenancy settings.

### Organization Management
- **Healthcare Facilities (`/organization/facilities`)**:
  - Paginated list and keyword filtering for registered healthcare facilities.
  - Create facility modal with validation (code, name, type, address, contact information).
  - Update facility details and toggle status (Active / Inactive) via `/api/v1/facilities/{id}/status`.
- **Service Units & Departments (`/organization/service-units`)**:
  - Manage clinical and administrative departments grouped by healthcare facility.
  - Filter service units dynamically by parent facility.
  - Create and edit unit codes, names, types (Inpatient, Outpatient, Emergency, Pharmacy, Lab, Radiology, etc.).
  - Status management (Active / Inactive) via `/api/v1/service-units/{id}/status`.

### Multi-Tenancy Management (`/tenancy`)
- **Tenant Directory**: View all registered tenant instances with isolation codes and active states.
- **Tenant Provisioning**: Register new tenant entities via `/api/platform/tenants`.
- **Dynamic Configuration Editor**: Manage key-value platform configurations and feature flags per tenant via `/api/platform/tenants/{id}/settings`.

### Identity & Access Management (IAM) (`/iam/*`)
- **Users (`/iam/users`)**: Search, create, and manage user accounts, assign roles, and associate tenant identifiers.
- **Groups (`/iam/groups`)**: Create functional groups and assign users to administrative teams.
- **Roles (`/iam/roles`)**: Define custom and system roles with granular scope mappings.
- **Scopes (`/iam/scopes`)**: Hierarchical view of fine-grained `resource:action` security scopes (e.g., `facility:read`, `facility:write`, `tenant:admin`).

---

## Project Structure

```
uwati-ui/
├── proxy.conf.json              # Development reverse proxy configuration (/api -> http://localhost:8080)
├── angular.json                 # Angular CLI workspace configuration
├── package.json                 # Dependencies and npm scripts
├── src/
│   ├── index.html               # Main HTML entry point
│   ├── main.ts                  # Application bootstrap
│   ├── styles.scss              # Global styles and CoreUI SCSS imports
│   ├── app/
│   │   ├── app.config.ts        # App configuration (providers, router, zoneless change detection)
│   │   ├── app.routes.ts        # Top-level routing definitions
│   │   ├── core/
│   │   │   ├── guards/          # AuthGuard and route protection
│   │   │   ├── interceptors/   # AuthInterceptor (JWT, Tenant, Correlation headers)
│   │   │   ├── models/          # TypeScript domain models (auth, facility, service-unit, tenancy, iam)
│   │   │   └── services/        # Angular services communicating with Uwati REST APIs
│   │   ├── layout/
│   │   │   └── default-layout/  # CoreUI layout shell, sidebar nav (_nav.ts), header, tenant switcher
│   │   └── views/
│   │       ├── authentication/  # Login component
│   │       ├── dashboard/       # Main overview dashboard
│   │       ├── organization/    # Facilities and Service Units components
│   │       ├── tenancy/         # Tenants and Tenant Settings components
│   │       └── iam/             # Users, Groups, Roles, Scopes components
```

---

## Getting Started

### Prerequisites

- **Node.js**: LTS version `^22.0.0` or higher
- **npm**: Package manager (included with Node.js)
- **Uwati Backend Service**: Running locally or accessible via network (default: `http://localhost:8080`)

### Installation

Clone the repository and install the project dependencies:

```bash
git clone <repository-url>
cd uwati-ui
npm install
```

### Development Server

Run the development server with the integrated API proxy:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you modify any source files.

> [!NOTE]
> `npm start` executes `ng serve --proxy-config proxy.conf.json`. All calls to `/api/*` will be forwarded automatically to `http://localhost:8080`.

### Production Build

To compile and optimize the application for production:

```bash
npm run build
```

The build artifacts will be output to the `dist/` directory, ready to be served by Nginx, Caddy, or any static hosting service.

---

## Backend Integration & API Routing

The frontend connects to the following Uwati backend REST endpoints:

| Domain | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate user credentials & receive JWT token |
| **Facilities** | `GET` | `/api/v1/facilities` | Retrieve paginated healthcare facilities |
| | `POST` | `/api/v1/facilities` | Register a new healthcare facility |
| | `GET` | `/api/v1/facilities/{id}` | Get facility details |
| | `PUT` | `/api/v1/facilities/{id}` | Update facility details |
| | `PATCH` | `/api/v1/facilities/{id}/status` | Activate or deactivate facility |
| **Service Units** | `GET` | `/api/v1/service-units` | Retrieve service units (filterable by `facilityId`) |
| | `POST` | `/api/v1/service-units` | Create a new service unit / department |
| | `GET` | `/api/v1/service-units/{id}` | Get service unit details |
| | `PUT` | `/api/v1/service-units/{id}` | Update service unit details |
| | `PATCH` | `/api/v1/service-units/{id}/status` | Activate or deactivate service unit |
| **Tenancy** | `GET` | `/api/platform/tenants` | List all platform tenants |
| | `POST` | `/api/platform/tenants` | Provision a new tenant |
| | `GET` | `/api/platform/tenants/{id}/settings` | Get tenant configuration settings |
| | `PUT` | `/api/platform/tenants/{id}/settings` | Update tenant configuration settings |
| **IAM** | `GET` / `POST` | `/api/v1/iam/users` | Manage IAM users |
| | `GET` / `POST` | `/api/v1/iam/groups` | Manage IAM user groups |
| | `GET` / `POST` | `/api/v1/iam/roles` | Manage IAM roles and scope bindings |
| | `GET` | `/api/v1/iam/scopes` | List system permissions & scopes |

---

## License

This project is licensed under the [MIT License](LICENSE).
