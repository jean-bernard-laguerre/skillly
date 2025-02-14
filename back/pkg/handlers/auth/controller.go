package auth

import (
	"github.com/gin-gonic/gin"
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
}
