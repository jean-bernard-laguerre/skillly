package middleware

import (
	"fmt"
	"skillly/pkg/models"
	"skillly/pkg/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware is a middleware that checks if the user is authenticated
// and if the user has the correct role to access the route

func AuthMiddleware(role utils.RoleType) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the token from the header
		authHeader := c.GetHeader("Authorization")
		// Check if the token is empty
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}
		// Remove the Bearer prefix
		authHeader = strings.TrimPrefix(authHeader, "Bearer ")

		// Check if the token is valid
		user := &jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(authHeader, user, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return []byte("secret"), nil
		})

		// Check if there is an error
		if err != nil {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		// Check if the token is valid
		if !token.Valid {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		// Check if the user has the correct role
		userRole, ok := (*user)["role"].(string)
		if (!ok) || userRole != string(role) {
			c.JSON(403, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		// Set the user in the context
		c.Set("user_id", (*user)["id"])
		c.Set("user_role", (*user)["role"])
		c.Set("user_first_name", (*user)["firstName"])
		c.Set("user_last_name", (*user)["lastName"])

		if role == models.RoleRecruiter {
			c.Set("company_id", (*user)["companyID"])
			c.Set("company_role", (*user)["companyRole"])
		}

		// Continue to the next middleware or handler
		c.Next()
	}
}
