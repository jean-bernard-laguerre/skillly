package company

import (
	"github.com/gin-gonic/gin"
)

// @Summary Lister toutes les entreprises
// @Description Récupère la liste de toutes les entreprises
// @Tags companies
// @Accept json
// @Produce json
// @Success 200 {array} map[string]interface{} "Liste des entreprises"
// @Router /company [get]
func GetAllCompaniesHandler(c *gin.Context) {
	services := NewCompanyService()
	services.GetAll(c)
}

func AddRoutes(r *gin.Engine) {
	co := r.Group("/company")

	co.GET("/", GetAllCompaniesHandler)
}
