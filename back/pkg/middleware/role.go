package middleware

import (
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

func RoleMiddleware(role utils.RoleType) gin.HandlerFunc {
	return func(c *gin.Context) {

		// Check if the user has the correct role
		if c.Keys["user_role"] != string(role) {
			c.JSON(403, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}
	}
}
