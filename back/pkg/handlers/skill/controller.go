package skill

import (
	"github.com/gin-gonic/gin"
)

// @Summary Créer une compétence
// @Description Crée une nouvelle compétence
// @Tags skills
// @Accept json
// @Produce json
// @Param skillData body skillDto.CreateSkillDTO true "Données de la compétence"
// @Success 201 {object} map[string]interface{} "Compétence créée avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Router /skill [post]
func CreateSkillHandler(c *gin.Context) {
	skillService := NewSkillService()
	skillService.CreateSkill(c)
}

// @Summary Lister toutes les compétences
// @Description Récupère la liste de toutes les compétences disponibles
// @Tags skills
// @Accept json
// @Produce json
// @Success 200 {array} map[string]interface{} "Liste des compétences"
// @Router /skill [get]
func GetAllSkillsHandler(c *gin.Context) {
	skillService := NewSkillService()
	skillService.GetAll(c)
}

func AddRoutes(r *gin.Engine) {
	sk := r.Group("/skill")

	sk.POST("/", CreateSkillHandler)
	sk.GET("/", GetAllSkillsHandler)
}
