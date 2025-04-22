package company

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {

	co := r.Group("/company")

	co.GET("/", func(c *gin.Context) {
		GetAll(c)
	})
}
