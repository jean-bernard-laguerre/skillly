package jobPost

import (
	"skillly/pkg/middleware"

	"skillly/pkg/models"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {
	jp := r.Group("/jobpost")
	jp.POST("/", middleware.AuthMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		CreatedJobPost(c)
	})
}
