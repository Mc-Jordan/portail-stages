<div align="center">

# 💼 Portail des stages

**Plateforme de gestion des stages universitaires**

Publication d'offres, candidatures, suivi et conventions de stage — mettant en
relation étudiants, entreprises, enseignants et administration.

[![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?logo=springboot&logoColor=white)](#stack-technique)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js_14-000000?logo=nextdotjs&logoColor=white)](#stack-technique)
[![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)](#)
[![DB](https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-informational)](#licence)

</div>

---

## Aperçu

Application **full-stack** de gestion des stages. Les **entreprises** publient des
offres, les **étudiants** postulent (CV, lettre de motivation), les **enseignants**
valident les conventions et l'**administration** supervise la plateforme.
Authentification **JWT**, messagerie **temps réel** (WebSocket), génération de
conventions **PDF** (PDFBox), notifications par **e-mail**.

L'interface adopte un **design system** teal + vert (Figtree / Noto Sans) au-dessus
de shadcn/ui.

## Fonctionnalités

| Domaine | Description |
|---|---|
| 🔐 **Authentification** | JWT, rôles étudiant / entreprise / enseignant / admin |
| 📢 **Offres de stage** | Publication, édition, recherche et filtrage |
| 📨 **Candidatures** | Postuler, suivre, accepter / refuser |
| 📄 **Conventions** | Validation enseignant, export **PDF** |
| 💬 **Messagerie** | Échanges temps réel (WebSocket) |
| 📊 **Administration** | Utilisateurs, rapports, supervision |

## Stack technique

**Backend** — Spring Boot 3 · Java 17 · Spring Security · Spring Data JPA ·
Spring WebSocket · JWT (jjwt) · PDFBox · Spring Mail · PostgreSQL · Maven ·
springdoc-openapi.

**Frontend** — Next.js 14 (App Router) · React · TypeScript · Tailwind CSS ·
shadcn/ui · Radix UI · React Query · React Hook Form · Zod · Zustand · Recharts.

## Structure du dépôt

```
gestion_stages/
├── backend/    # API Spring Boot (Java 17, Maven) — context-path /api
│   └── src/main/java/com/university/internship/
│       ├── controller/  service/  repository/
│       ├── model/  dto/  security/  config/
├── frontend/internship-portal-frontend/   # Next.js 14 + Tailwind + shadcn/ui
│   ├── app/          # App Router (auth, dashboard par rôle)
│   ├── components/   # ui (shadcn), custom, providers
│   ├── lib/  hooks/  store/  types/
├── docs/       # documentation détaillée
└── README.md
```

## Démarrage rapide

> Prérequis : **Java 17+**, **Maven**, **Node 18+**, **PostgreSQL 14+**.

```bash
createdb internship_management

# Backend (port 8080, API sous /api)
cd backend
export DB_USERNAME=internship_user DB_PASSWORD=changeme JWT_SECRET="<clé>"
./mvnw spring-boot:run

# Frontend (port 3000)
cd ../frontend/internship-portal-frontend
npm install
npm run dev
```

Swagger UI : `http://localhost:8080/api/swagger-ui.html`. Guide : [`docs/SETUP.md`](docs/SETUP.md).

## Documentation

| Document | Contenu |
|---|---|
| [`docs/SETUP.md`](docs/SETUP.md) | Installation, variables d'environnement, exécution |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Architecture, modules, sécurité |
| [`docs/API.md`](docs/API.md) | Référence des endpoints REST |

## Rôles

| Rôle | Accès |
|---|---|
| **STUDENT** | Recherche d'offres, candidatures, suivi |
| **COMPANY** | Publication d'offres, gestion des candidatures |
| **TEACHER** | Validation des conventions de stage |
| **ADMIN** | Supervision, utilisateurs, rapports |

## Licence

Distribué sous licence **MIT**. Voir [`LICENSE`](LICENSE).
