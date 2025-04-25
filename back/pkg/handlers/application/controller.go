package application

import (
	"skillly/pkg/middleware"
	"skillly/pkg/models"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {

	applicationService := NewApplicationService()

	app := r.Group("/application")
	app.POST("/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), func(c *gin.Context) {
		applicationService.CreateApplication(c)
	})

	app.GET("/jobpost/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		applicationService.GetOfferApplications(c)
	})

	app.GET("/me", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), func(c *gin.Context) {
		applicationService.GetMe(c)
	})

}
