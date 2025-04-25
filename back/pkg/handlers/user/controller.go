package user

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
)

func AddRoutes(r *gin.Engine) {
	us := r.Group("/user")

	userService := NewUserService()

	us.POST("/", middleware.AuthMiddleware(), func(c *gin.Context) {
		userService.CreateUser(c)
	})

	us.GET("/", middleware.AuthMiddleware(), func(c *gin.Context) {
		userService.GetAll(c)
	})

	us.GET("/:id", middleware.AuthMiddleware(), func(c *gin.Context) {
		userService.GetById(c)
	})

	us.PUT("/:id", middleware.AuthMiddleware(), func(c *gin.Context) {
		userService.UpdateUser(c)
	})

	us.DELETE("/:id", middleware.AuthMiddleware(), func(c *gin.Context) {
		userService.DeleteUser(c)
	})

	us.PATCH("/me/skills", middleware.AuthMiddleware(), func(c *gin.Context) {
		userService.AddUserSkills(c)
	})

	us.DELETE("/me/skills", middleware.AuthMiddleware(), func(c *gin.Context) {
		userService.DeleteUserSkill(c)
	})
}
