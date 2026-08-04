# Installation & exécution

## Prérequis

| Outil | Version |
|---|---|
| Java (JDK) | 17+ |
| Maven | 3.9+ (wrapper `./mvnw`) |
| Node.js | 18+ |
| PostgreSQL | 14+ |

## 1. Base de données

```sql
CREATE DATABASE internship_management;
CREATE USER internship_user WITH ENCRYPTED PASSWORD 'changeme';
GRANT ALL PRIVILEGES ON DATABASE internship_management TO internship_user;
```

## 2. Variables d'environnement (backend)

Aucun secret en dur : surcharge par variables d'environnement.

| Variable | Défaut | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/internship_management` | URL JDBC |
| `DB_USERNAME` | `internship_user` | Utilisateur DB |
| `DB_PASSWORD` | `changeme` | Mot de passe DB |
| `JWT_SECRET` | *(clé de dev)* | Clé de signature JWT (forte en prod) |
| `JWT_EXPIRATION` | `86400000` | Durée du token (ms) |
| `MAIL_HOST` | `smtp.gmail.com` | Serveur SMTP |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | *(vide)* | Identifiants SMTP |

```bash
export DB_PASSWORD='monMotDePasse'
export JWT_SECRET="$(openssl rand -base64 48)"
# Pour l'e-mail Gmail : utilisez un « mot de passe d'application » dédié.
export MAIL_USERNAME='vous@gmail.com'
export MAIL_PASSWORD='<mot-de-passe-application>'
```

> ⚠️ En production, définissez impérativement `JWT_SECRET`, `DB_PASSWORD` et les
> identifiants e-mail. Ne réutilisez jamais les valeurs par défaut.

## 3. Backend (port 8080, API sous `/api`)

```bash
cd backend
./mvnw spring-boot:run
./mvnw clean package     # build → target/*.jar
```

Swagger UI : `http://localhost:8080/api/swagger-ui.html`.

## 4. Frontend (port 3000)

```bash
cd frontend/internship-portal-frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
```

Configurez l'URL de l'API du frontend via ses variables d'environnement
(`.env.local`, ex. `NEXT_PUBLIC_API_URL=http://localhost:8080/api`).

## Dépannage

| Problème | Piste |
|---|---|
| `Connection refused` DB | PostgreSQL démarré ? `DB_URL` correct ? |
| 401 sur l'API | Token expiré / absent — reconnectez-vous |
| E-mail non envoyé | Gmail exige un mot de passe d'application (2FA activée) |
