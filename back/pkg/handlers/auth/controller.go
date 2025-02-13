package auth

import (
	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {

	r.POST("/login", func(c *gin.Context) {
		Login(c)
	})
	r.POST("/register", func(c *gin.Context) {
		Register(c)
	})
}
