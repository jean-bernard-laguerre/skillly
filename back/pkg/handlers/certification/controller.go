package certification

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {

	certificationService := NewCertificationService()

	crt := r.Group("/certification")

	crt.POST("/", func(c *gin.Context) {
		certificationService.CreateCertification(c)
	})

	crt.GET("/", func(c *gin.Context) {
		certificationService.GetAll(c)
	})
}
