package company

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {

	services := NewCompanyService()

	co := r.Group("/company")

	co.GET("/", func(c *gin.Context) {
		services.GetAll(c)
	})
}
