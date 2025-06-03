package user

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
)

// @Summary Créer un utilisateur
// @Description Crée un nouveau utilisateur (admin uniquement)
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param userData body userDto.CreateUserDTO true "Données de l'utilisateur"
// @Success 201 {object} map[string]interface{} "Utilisateur créé avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Router /user [post]
func CreateUserHandler(c *gin.Context) {
	userService := NewUserService()
	userService.CreateUser(c)
}

// @Summary Lister tous les utilisateurs
// @Description Récupère la liste de tous les utilisateurs
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} map[string]interface{} "Liste des utilisateurs"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Router /user [get]
func GetAllUsersHandler(c *gin.Context) {
	userService := NewUserService()
	userService.GetAll(c)
}

// @Summary Récupérer un utilisateur par ID
// @Description Récupère les détails d'un utilisateur spécifique
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'utilisateur"
// @Success 200 {object} map[string]interface{} "Détails de l'utilisateur"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 404 {object} map[string]string "Utilisateur non trouvé"
// @Router /user/{id} [get]
func GetUserByIdHandler(c *gin.Context) {
	userService := NewUserService()
	userService.GetById(c)
}

// @Summary Mettre à jour un utilisateur
// @Description Met à jour les informations d'un utilisateur
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'utilisateur"
// @Param userData body userDto.UpdateUserDTO true "Nouvelles données de l'utilisateur"
// @Success 200 {object} map[string]interface{} "Utilisateur mis à jour"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 404 {object} map[string]string "Utilisateur non trouvé"
// @Router /user/{id} [put]
func UpdateUserHandler(c *gin.Context) {
	userService := NewUserService()
	userService.UpdateUser(c)
}

// @Summary Supprimer un utilisateur
// @Description Supprime un utilisateur
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'utilisateur"
// @Success 200 {object} map[string]string "Utilisateur supprimé"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 404 {object} map[string]string "Utilisateur non trouvé"
// @Router /user/{id} [delete]
func DeleteUserHandler(c *gin.Context) {
	userService := NewUserService()
	userService.DeleteUser(c)
}

// @Summary Ajouter des compétences à l'utilisateur
// @Description Ajoute des compétences au profil de l'utilisateur connecté
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param skillsData body userDto.UpdateUserSkillsDTO true "Compétences à ajouter"
// @Success 200 {object} map[string]interface{} "Compétences ajoutées"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Router /user/me/skills [patch]
func AddUserSkillsHandler(c *gin.Context) {
	userService := NewUserService()
	userService.AddUserSkills(c)
}

// @Summary Supprimer des compétences de l'utilisateur
// @Description Supprime des compétences du profil de l'utilisateur connecté
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param skillsData body userDto.DeleteUserSkillsDTO true "Compétences à supprimer"
// @Success 200 {object} map[string]interface{} "Compétences supprimées"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Router /user/me/skills [delete]
func DeleteUserSkillsHandler(c *gin.Context) {
	userService := NewUserService()
	userService.DeleteUserSkill(c)
}

func AddRoutes(r *gin.Engine) {
	us := r.Group("/user")

	us.POST("/", middleware.AuthMiddleware(), CreateUserHandler)
	us.GET("/", middleware.AuthMiddleware(), GetAllUsersHandler)
	us.GET("/:id", middleware.AuthMiddleware(), GetUserByIdHandler)
	us.PUT("/:id", middleware.AuthMiddleware(), UpdateUserHandler)
	us.DELETE("/:id", middleware.AuthMiddleware(), DeleteUserHandler)
	us.PATCH("/me/skills", middleware.AuthMiddleware(), AddUserSkillsHandler)
	us.DELETE("/me/skills", middleware.AuthMiddleware(), DeleteUserSkillsHandler)
}
