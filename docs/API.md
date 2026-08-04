# Référence API REST

Base : `http://localhost:8080/api`  (context-path `/api`)
Documentation interactive : **Swagger UI** (`/api/swagger-ui.html`).

Sauf mention contraire, les endpoints exigent `Authorization: Bearer <token>`.

## Authentification — `/auth`

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Non | Créer un compte |
| `POST` | `/auth/login` | Non | Se connecter, renvoie le token JWT |

## Offres de stage — `/offers`

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/offers` | Lister / rechercher les offres |
| `GET` | `/offers/{id}` | Détail d'une offre |
| `POST` | `/offers` | Publier une offre (entreprise) |
| `PUT` | `/offers/{id}` | Mettre à jour une offre |
| `DELETE` | `/offers/{id}` | Supprimer une offre |

## Candidatures — `/applications`

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/applications` | Lister les candidatures (selon le rôle) |
| `POST` | `/applications` | Postuler à une offre (CV, lettre) |
| `PUT`/`PATCH` | `/applications/{id}` | Accepter / refuser / mettre à jour |

## Conventions — `/agreements`

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/agreements` | Lister les conventions |
| `POST` | `/agreements` | Créer une convention |
| `PUT`/`PATCH` | `/agreements/{id}` | Valider (enseignant) |
| `GET` | `/agreements/{id}/pdf` | Télécharger la convention (PDF) |

## Administration — `/admin`

| Méthode | Chemin | Rôle | Description |
|---|---|---|---|
| `GET` | `/admin/users` | ADMIN | Gestion des utilisateurs |
| `GET` | `/admin/reports` | ADMIN | Rapports et statistiques |

## Messagerie (WebSocket)

- Endpoint STOMP/WebSocket pour les échanges temps réel entre utilisateurs.

> Les schémas de payload détaillés sont disponibles dans Swagger UI et `dto/`.
