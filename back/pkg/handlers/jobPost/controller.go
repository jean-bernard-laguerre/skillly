package jobPost

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
	"skillly/pkg/models"
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
