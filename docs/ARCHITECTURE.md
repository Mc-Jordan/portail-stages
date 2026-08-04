# Architecture

## Vue d'ensemble

Application **client-serveur** découplée :

- **frontend** Next.js (App Router, SSR/CSR) consommant l'**API REST** ;
- **backend** Spring Boot exposant l'API (context-path `/api`), gérant la
  sécurité **JWT** et la persistance dans **PostgreSQL** ;
- **WebSocket** pour la messagerie temps réel ; **PDFBox** pour les conventions.

```
Next.js (React) ──HTTP/JSON + JWT──▶ API REST (/api) ──JPA──▶ PostgreSQL
        │                                │
        └──────────WebSocket─────────────┘   (messagerie)
```

## Backend — couches

| Couche | Rôle |
|---|---|
| `controller/` | Endpoints REST, validation |
| `service/` | Logique métier (offres, candidatures, conventions) |
| `repository/` | Accès données (Spring Data JPA) |
| `model/` | Entités persistées |
| `dto/` | Objets de transfert |
| `security/` | JWT, filtres, configuration de sécurité |
| `config/` | Configuration (WebSocket, CORS, etc.) |

## Domaines fonctionnels

- **auth** — connexion JWT, rôles.
- **offers** — offres de stage (entreprises).
- **applications** — candidatures (étudiants).
- **agreements** — conventions (validation enseignant, PDF).
- **messages** — messagerie temps réel.
- **admin** — supervision, utilisateurs, rapports.

## Sécurité

- **JWT** : token à la connexion, envoyé via `Authorization: Bearer`.
- Filtre de validation à chaque requête.
- Autorisation par rôle : `STUDENT`, `COMPANY`, `TEACHER`, `ADMIN`.

## Frontend — organisation

- **Next.js App Router** : dossier `app/` avec groupes `(auth)` et `(dashboard)`,
  un espace par rôle (admin, company, student, teacher).
- **shadcn/ui** (Radix) pour les composants, **React Query** pour les données,
  **React Hook Form + Zod** pour les formulaires, **Zustand** pour l'état,
  **Recharts** pour les graphiques.
- **Design system** : thème teal appliqué via les tokens shadcn (`--primary`
  recoloré) dans `app/globals.css`, typographie Figtree / Noto Sans.
