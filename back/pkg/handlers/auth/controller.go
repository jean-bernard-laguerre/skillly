package auth

import (
	"github.com/gin-gonic/gin"

	authMiddleware "skillly/pkg/middleware"
)

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

// @Summary Inscription candidat
// @Description Crée un nouveau compte candidat
// @Tags auth
// @Accept json
// @Produce json
// @Param candidateData body authDto.CandidateRegisterDTO true "Données d'inscription candidat"
// @Success 201 {object} map[string]interface{} "Compte créé avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 409 {object} map[string]string "Email déjà utilisé"
// @Router /auth/signup/candidate [post]
func RegisterCandidateHandler(c *gin.Context) {
	authService := NewAuthService()
	authService.RegisterCandidate(c)
}

// @Summary Inscription recruteur
// @Description Crée un nouveau compte recruteur
// @Tags auth
// @Accept json
// @Produce json
// @Param recruiterData body authDto.RecruterRegisterDTO true "Données d'inscription recruteur"
// @Success 201 {object} map[string]interface{} "Compte créé avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 409 {object} map[string]string "Email déjà utilisé"
// @Router /auth/signup/recruiter [post]
func RegisterRecruiterHandler(c *gin.Context) {
	authService := NewAuthService()
	authService.RegisterRecruiter(c)
}

// @Summary Profil utilisateur actuel
// @Description Récupère les informations de l'utilisateur connecté
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{} "Informations utilisateur"
// @Failure 401 {object} map[string]string "Token manquant ou invalide"
// @Router /auth/me [get]
func GetCurrentUserHandler(c *gin.Context) {
	authService := NewAuthService()
	authService.GetCurrentUser(c)
}

func AddRoutes(r *gin.Engine) {
	au := r.Group("/auth")

	au.POST("/login", LoginHandler)
	au.POST("/signup/candidate", RegisterCandidateHandler)
	au.POST("/signup/recruiter", RegisterRecruiterHandler)
	au.GET("/me", authMiddleware.AuthMiddleware(), GetCurrentUserHandler)
}
