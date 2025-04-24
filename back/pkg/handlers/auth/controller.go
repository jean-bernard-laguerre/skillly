package auth

import (
	"github.com/gin-gonic/gin"
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
}
