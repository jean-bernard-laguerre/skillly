package match

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
	"skillly/pkg/models"
)

func AddRoutes(r *gin.Engine) {
	matchService := NewMatchService()

	matchGroup := r.Group("/match")
	// Protect the route: only authenticated recruiters can create matches
	matchGroup.POST("", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		matchService.CreateMatch(c)
	})

	// Add other match-related routes here if needed (GET, DELETE, etc.)
}
