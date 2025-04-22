package certification

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {
	crt := r.Group("/certification")

	crt.POST("/", func(c *gin.Context) {
		CreateCertification(c)
	})

	crt.GET("/", func(c *gin.Context) {
		GetAll(c)
	})
}
