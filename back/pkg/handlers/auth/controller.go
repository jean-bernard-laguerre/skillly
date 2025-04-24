package auth

import (
	"github.com/gin-gonic/gin"

	authMiddleware "skillly/pkg/middleware"
)

func AddRoutes(r *gin.Engine) {

	au := r.Group("/auth")

	au.POST("/login", func(c *gin.Context) {
		Login(c)
	})
	au.POST("/signup/candidate", func(c *gin.Context) {
		RegisterCandidate(c)
	})
	au.POST("/signup/recruiter", func(c *gin.Context) {
		RegisterRecruiter(c)
	})

	au.GET("/me", authMiddleware.AuthMiddleware(), func(c *gin.Context) {
		GetCurrentUser(c)
	})
}
