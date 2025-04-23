package application

import (
	"skillly/pkg/middleware"
	"skillly/pkg/models"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {
	app := r.Group("/application")
	app.POST("/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), func(c *gin.Context) {
		CreateApplication(c)
	})
	app.GET("/company")

	app.GET("/jobpost/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		// get all jobpost application
	})

	app.GET("/me", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), func(c *gin.Context) {
		// get all candidate application
	})

}
