package skill

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {
	sk := r.Group("/skill")

	sk.POST("/", func(c *gin.Context) {
		CreateSkill(c)
	})
	sk.GET("/", func(c *gin.Context) {
		GetAll(c)
	})
}
