package auth

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {

	au := r.Group("/auth")

	au.POST("/login", func(c *gin.Context) {
		Login(c)
	})
	au.POST("/register", func(c *gin.Context) {
		Register(c)
	})
}
