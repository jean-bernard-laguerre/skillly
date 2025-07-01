package certification

import (
	"github.com/gin-gonic/gin"
)

// @Summary Créer une certification
// @Description Crée une nouvelle certification
// @Tags certifications
// @Accept json
// @Produce json
// @Param certificationData body certificationDto.CreateCertificationDTO true "Données de la certification"
// @Success 201 {object} map[string]interface{} "Certification créée avec succès"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Router /certification [post]
func CreateCertificationHandler(c *gin.Context) {
	certificationService := NewCertificationService()
	certificationService.CreateCertification(c)
}

// @Summary Lister toutes les certifications
// @Description Récupère la liste de toutes les certifications disponibles
// @Tags certifications
// @Accept json
// @Produce json
// @Success 200 {array} map[string]interface{} "Liste des certifications"
// @Router /certification [get]
func GetAllCertificationsHandler(c *gin.Context) {
	certificationService := NewCertificationService()
	certificationService.GetAll(c)
}

func AddRoutes(r *gin.Engine) {
	crt := r.Group("/certification")

	crt.POST("/", CreateCertificationHandler)
	crt.GET("/", GetAllCertificationsHandler)
}
