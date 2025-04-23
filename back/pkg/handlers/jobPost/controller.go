package jobPost

import (
	"skillly/pkg/middleware"

	"skillly/pkg/models"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {
	jp := r.Group("/jobpost")
	jp.POST("/", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		CreateJobPost(c)
	})

	jp.GET("/", func(c *gin.Context) {
		GetAll(c)
	})
}
