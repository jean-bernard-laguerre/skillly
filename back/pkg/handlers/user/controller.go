package user

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
)

func AddRoutes(r *gin.Engine) {
	us := r.Group("/user")

	us.POST("/", middleware.AuthMiddleware(), func(c *gin.Context) {
		CreateUser(c)
	})

	us.GET("/", middleware.AuthMiddleware(), func(c *gin.Context) {
		GetAll(c)
	})

	us.GET("/:id", middleware.AuthMiddleware(), func(c *gin.Context) {
		GetById(c)
	})

	us.PUT("/:id", middleware.AuthMiddleware(), func(c *gin.Context) {
		UpdateUser(c)
	})

	us.DELETE("/:id", middleware.AuthMiddleware(), func(c *gin.Context) {
		DeleteUser(c)
	})

	us.PATCH("/:id/skills", middleware.AuthMiddleware(), func(c *gin.Context) {
		AddUserSkills(c)
	})

	us.DELETE("/:id/skills/:skillId", middleware.AuthMiddleware(), func(c *gin.Context) {
		DeleteUserSkill(c)
	})

	us.DELETE("/:id/certifications/:certificationId", middleware.AuthMiddleware(), func(c *gin.Context) {
		DeleteUserCertification(c)
	})
}
