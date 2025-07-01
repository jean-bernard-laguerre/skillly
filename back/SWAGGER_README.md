# Documentation Swagger pour Skillly API

## 🚀 Accès à la documentation

Une fois votre serveur démarré (`go run main.go`), vous pouvez accéder à la documentation Swagger à l'adresse :

**http://localhost:8080/swagger/index.html**

## 📋 Routes documentées

### 🔐 Authentification (`/auth`)

- `POST /auth/login` - Connexion utilisateur
- `POST /auth/signup/candidate` - Inscription candidat
- `POST /auth/signup/recruiter` - Inscription recruteur
- `GET /auth/me` - Profil utilisateur actuel (🔒 protégé)

### 👥 Utilisateurs (`/user`)

- `POST /user` - Créer un utilisateur (🔒 protégé)
- `GET /user` - Lister tous les utilisateurs (🔒 protégé)
- `GET /user/{id}` - Récupérer un utilisateur par ID (🔒 protégé)
- `PUT /user/{id}` - Mettre à jour un utilisateur (🔒 protégé)
- `DELETE /user/{id}` - Supprimer un utilisateur (🔒 protégé)
- `PATCH /user/me/skills` - Ajouter des compétences (🔒 protégé)
- `DELETE /user/me/skills` - Supprimer des compétences (🔒 protégé)

### 💼 Offres d'emploi (`/jobpost`)

- `POST /jobpost` - Créer une offre d'emploi (🔒 recruteurs uniquement)
- `GET /jobpost/candidate` - Lister les offres pour candidats (🔒 candidats uniquement)
- `GET /jobpost/company` - Lister les offres de l'entreprise (🔒 recruteurs uniquement)
- `GET /jobpost/{id}` - Récupérer une offre par ID (public)

### 📝 Candidatures (`/application`)

- `POST /application/{id}` - Postuler à une offre d'emploi (🔒 candidats uniquement)
- `GET /application/jobpost/{id}` - Récupérer les candidatures d'une offre (🔒 recruteurs uniquement)
- `GET /application/me` - Récupérer mes candidatures (🔒 candidats uniquement)
- `PUT /application/{id}/state` - Mettre à jour le statut d'une candidature (🔒 recruteurs uniquement)

### 🎯 Compétences (`/skill`)

- `POST /skill` - Créer une compétence
- `GET /skill` - Lister toutes les compétences

### 🏢 Entreprises (`/company`)

- `GET /company` - Lister toutes les entreprises

### 🤝 Matchs (`/match`)

- `POST /match` - Créer un match candidat/offre (🔒 recruteurs uniquement)

### 🏆 Certifications (`/certification`)

- `POST /certification` - Créer une certification
- `GET /certification` - Lister toutes les certifications

### 🌐 Autres

- `GET /` - Hello World (test)
- `GET /ws/{roomId}` - Connexion WebSocket pour le chat

## ⚡ Génération rapide

Utilisez le script fourni pour régénérer la documentation :

```bash
./generate-swagger.sh
```

Ou manuellement :

```bash
swag init --parseDependency --parseInternal
```

## 📝 Comment ajouter de la documentation à vos routes

### 1. Annotations de base pour une route

```go
// @Summary Titre court de l'endpoint
// @Description Description détaillée de ce que fait l'endpoint
// @Tags nom-du-tag
// @Accept json
// @Produce json
// @Param paramName body/query/path TypeDto true/false "Description du paramètre"
// @Success 200 {object} ResponseType "Description du succès"
// @Failure 400 {object} map[string]string "Description de l'erreur"
// @Router /chemin/vers/endpoint [get/post/put/delete]
```

### 2. Exemple concret

```go
// @Summary Connexion utilisateur
// @Description Authentifie un utilisateur avec email et mot de passe
// @Tags auth
// @Accept json
// @Produce json
// @Param loginData body authDto.LoginDto true "Données de connexion"
// @Success 200 {object} map[string]interface{} "Token JWT et informations utilisateur"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Identifiants incorrects"
// @Router /auth/login [post]
func LoginHandler(c *gin.Context) {
    authService := NewAuthService()
    authService.Login(c)
}
```

### 3. Routes protégées (avec authentification)

Pour les routes qui nécessitent une authentification, ajoutez :

```go
// @Security BearerAuth
```

### 4. Types de paramètres

- `body` : Données dans le corps de la requête (POST/PUT)
- `query` : Paramètres de requête (?param=value)
- `path` : Paramètres dans l'URL (/users/{id})
- `header` : Paramètres dans les headers

### 5. Régénérer la documentation

Après avoir ajouté de nouvelles annotations, exécutez :

```bash
./generate-swagger.sh
```

## 🏷️ Tags utilisés

- `auth` : Authentification et autorisation
- `users` : Gestion des utilisateurs
- `jobs` : Offres d'emploi
- `applications` : Candidatures
- `skills` : Compétences
- `companies` : Entreprises
- `matches` : Matching
- `certifications` : Certifications
- `websocket` : WebSocket/Chat

## 📋 Structure des DTOs

Assurez-vous que vos DTOs sont bien structurés avec les tags JSON :

```go
type LoginDto struct {
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
}
```

## 🔧 Configuration avancée

### Personnaliser les informations générales

Modifiez les annotations dans `main.go` :

```go
// @title Nom de votre API
// @version 1.0
// @description Description de votre API
// @host localhost:8080
// @BasePath /
```

### Ajouter des exemples

```go
// @Param user body UserDto true "User data" example({"name":"John","email":"john@example.com"})
```

## 🎯 Bonnes pratiques

1. **Utilisez des tags cohérents** pour grouper vos endpoints
2. **Documentez tous les codes de retour possibles**
3. **Ajoutez des descriptions claires et en français**
4. **Utilisez des DTOs typés** plutôt que `map[string]interface{}`
5. **Régénérez la doc après chaque modification**
6. **Créez des fonctions handler nommées** (pas de fonctions anonymes)

## 🔍 Dépannage

### Erreur "no required module provides package skillly/docs"

Exécutez `./generate-swagger.sh` pour générer les fichiers de documentation.

### La documentation ne se met pas à jour

1. Vérifiez que vos annotations sont correctes
2. Exécutez `./generate-swagger.sh`
3. Redémarrez votre serveur

### Routes non visibles dans Swagger

Vérifiez que :

- Les annotations sont juste au-dessus de la définition de fonction (pas de fonction anonyme)
- La syntaxe des annotations est correcte
- Vous avez exécuté `./generate-swagger.sh`
