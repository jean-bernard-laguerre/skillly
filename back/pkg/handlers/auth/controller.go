package auth

import (
	"github.com/gin-gonic/gin"

	authMiddleware "skillly/pkg/middleware"
)

func AddRoutes(r *gin.Engine) {

	authService := NewAuthService()

	au := r.Group("/auth")

	au.POST("/login", func(c *gin.Context) {
		authService.Login(c)
	})
	au.POST("/signup/candidate", func(c *gin.Context) {
		authService.RegisterCandidate(c)
	})
	au.POST("/signup/recruiter", func(c *gin.Context) {
		authService.RegisterRecruiter(c)
	})

	au.GET("/me", authMiddleware.AuthMiddleware(), func(c *gin.Context) {
		authService.GetCurrentUser(c)
	})
}
