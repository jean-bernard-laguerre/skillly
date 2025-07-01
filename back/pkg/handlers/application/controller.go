package application

import (
	"skillly/pkg/middleware"
	"skillly/pkg/models"

	"github.com/gin-gonic/gin"
)

// @Summary Créer une candidature
// @Description Permet à un candidat de postuler à une offre d'emploi
// @Tags applications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'offre d'emploi"
// @Param applicationData body applicationDto.CreateApplicationDTO true "Données de la candidature"
// @Success 201 {object} map[string]interface{} "Candidature créée avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - candidats uniquement"
// @Router /application/{id} [post]
func CreateApplicationHandler(c *gin.Context) {
	applicationService := NewApplicationService()
	applicationService.CreateApplication(c)
}

// @Summary Récupérer les candidatures d'une offre
// @Description Permet à un recruteur de voir toutes les candidatures pour une offre d'emploi
// @Tags applications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'offre d'emploi"
// @Success 200 {array} map[string]interface{} "Liste des candidatures"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - recruteurs uniquement"
// @Failure 404 {object} map[string]string "Offre d'emploi non trouvée"
// @Router /application/jobpost/{id} [get]
func GetOfferApplicationsHandler(c *gin.Context) {
	applicationService := NewApplicationService()
	applicationService.GetOfferApplications(c)
}

// @Summary Récupérer mes candidatures
// @Description Permet à un candidat de voir toutes ses candidatures
// @Tags applications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} map[string]interface{} "Liste de mes candidatures"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - candidats uniquement"
// @Router /application/me [get]
func GetMyApplicationsHandler(c *gin.Context) {
	applicationService := NewApplicationService()
	applicationService.GetMe(c)
}

// @Summary Mettre à jour le statut d'une candidature
// @Description Permet à un recruteur de changer le statut d'une candidature (pending, matched, rejected, accepted)
// @Tags applications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de la candidature"
// @Param stateData body applicationDto.UpdateApplicationStateDTO true "Nouveau statut"
// @Success 200 {object} map[string]interface{} "Statut mis à jour avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - recruteurs uniquement"
// @Failure 404 {object} map[string]string "Candidature non trouvée"
// @Router /application/{id}/state [put]
func UpdateApplicationStateHandler(c *gin.Context) {
	applicationService := NewApplicationService()
	applicationService.UpdateApplicationState(c)
}

func AddRoutes(r *gin.Engine) {
	app := r.Group("/application")

	app.POST("/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), CreateApplicationHandler)
	app.GET("/jobpost/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), GetOfferApplicationsHandler)
	app.GET("/me", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), GetMyApplicationsHandler)
	app.PUT("/:id/state", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), UpdateApplicationStateHandler)
}
