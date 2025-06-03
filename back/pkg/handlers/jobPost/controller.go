package jobPost

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

// @Summary Créer une offre d'emploi
// @Description Crée une nouvelle offre d'emploi (recruteurs uniquement)
// @Tags jobs
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param jobData body jobPostDto.CreateJobPostDTO true "Données de l'offre d'emploi"
// @Success 201 {object} map[string]interface{} "Offre d'emploi créée avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - recruteurs uniquement"
// @Router /jobpost [post]
func CreateJobPostHandler(c *gin.Context) {
	jobPostService := NewJobPostService()
	jobPostService.CreateJobPost(c)
}

// @Summary Lister les offres d'emploi pour candidats
// @Description Récupère toutes les offres d'emploi disponibles (candidats uniquement)
// @Tags jobs
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} map[string]interface{} "Liste des offres d'emploi"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - candidats uniquement"
// @Router /jobpost/candidate [get]
func GetAllJobPostsHandler(c *gin.Context) {
	jobPostService := NewJobPostService()
	jobPostService.GetAll(c)
}

// @Summary Lister les offres d'emploi de l'entreprise
// @Description Récupère les offres d'emploi de l'entreprise du recruteur connecté
// @Tags jobs
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} map[string]interface{} "Liste des offres d'emploi de l'entreprise"
// @Failure 401 {object} map[string]string "Non autorisé"
// @Failure 403 {object} map[string]string "Accès refusé - recruteurs uniquement"
// @Router /jobpost/company [get]
func GetJobPostsByCompanyHandler(c *gin.Context) {
	jobPostService := NewJobPostService()
	jobPostService.GetByCompany(c)
}

// @Summary Récupérer une offre d'emploi par ID
// @Description Récupère les détails d'une offre d'emploi spécifique
// @Tags jobs
// @Accept json
// @Produce json
// @Param id path int true "ID de l'offre d'emploi"
// @Param populate query string false "Relations à inclure (ex: skills,company)"
// @Success 200 {object} map[string]interface{} "Détails de l'offre d'emploi"
// @Failure 404 {object} map[string]string "Offre d'emploi non trouvée"
// @Router /jobpost/{id} [get]
func GetJobPostByIdHandler(c *gin.Context) {
	jobPostService := NewJobPostService()
	params := utils.GetUrlParams(c)
	jobPostId, _ := utils.GetId(c)
	jobpost, _ := jobPostService.GetByID(uint(jobPostId), &params.Populate)
	c.JSON(200, jobpost)
}

func AddRoutes(r *gin.Engine) {
	jp := r.Group("/jobpost")
	jp.POST("/", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), CreateJobPostHandler)
	jp.GET("/candidate", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), GetAllJobPostsHandler)
	jp.GET("/company", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), GetJobPostsByCompanyHandler)
	jp.GET("/:id", GetJobPostByIdHandler)
}
