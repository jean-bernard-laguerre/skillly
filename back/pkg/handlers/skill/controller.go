package skill

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {

	skillService := NewSkillService()

	sk := r.Group("/skill")

	sk.POST("/", func(c *gin.Context) {
		skillService.CreateSkill(c)
	})
	sk.GET("/", func(c *gin.Context) {
		skillService.GetAll(c)
	})
}
