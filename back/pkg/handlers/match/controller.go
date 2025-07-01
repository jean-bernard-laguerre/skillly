package match

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
	"skillly/pkg/models"
)

// @Summary Créer un match
// @Description Permet à un recruteur de créer un match entre un candidat et une offre d'emploi
// @Tags matches
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param matchData body matchDto.CreateMatchDTO true "Données du match"
// @Success 201 {object} map[string]interface{} "Match créé avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - recruteurs uniquement"
// @Failure 404 {object} map[string]string "Candidat, offre d'emploi ou candidature non trouvé(e)"
// @Router /match [post]
func CreateMatchHandler(c *gin.Context) {
	matchService := NewMatchService()
	matchService.CreateMatch(c)
}

func AddRoutes(r *gin.Engine) {
	matchGroup := r.Group("/match")

	// Protect the route: only authenticated recruiters can create matches
	matchGroup.POST("", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), CreateMatchHandler)

	// Add other match-related routes here if needed (GET, DELETE, etc.)
}
