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

func AuthMiddleware() gin.HandlerFunc {
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
		if !ok {
			c.JSON(403, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		// Set the user in the context
		userID, _ := (*user)["id"].(float64)

		c.Set("user_id", uint(userID))
		c.Set("user_role", (*user)["role"])
		c.Set("user_first_name", (*user)["firstName"])
		c.Set("user_last_name", (*user)["lastName"])

		if utils.RoleType(userRole) == models.RoleRecruiter {
			companyID, _ := (*user)["companyID"].(float64)
			recruiterID, _ := (*user)["recruiterID"].(float64)

			c.Set("company_id", uint(companyID))
			c.Set("recruiter_id", uint(recruiterID))
			c.Set("company_role", (*user)["companyRole"])
		} else if utils.RoleType(userRole) == models.RoleCandidate {
			candidateID, _ := (*user)["candidateID"].(float64)

			c.Set("candidate_id", uint(candidateID))
		} else {
			c.JSON(403, gin.H{"error": "Invalid Role"})
			c.Abort()
			return
		}

		// Continue to the next middleware or handler
		c.Next()
	}
}
