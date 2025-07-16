package middleware_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"skillly/pkg/middleware"
	"skillly/pkg/models"
	testUtils "skillly/test/utils"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRoleMiddleware(t *testing.T) {

	// Create a new Gin engine
	r := gin.Default()

	// Apply the RoleMiddleware to a test route
	r.GET("/test", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	// Create a test request with the correct role
	req, _ := http.NewRequest("GET", "/test", nil)
	token, _ := testUtils.RecruiterToken.SignedString([]byte("secret"))
	req.Header.Set("Authorization", "Bearer "+token) // Use a valid token for testing

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(w, req)

	// Assert the response status code
	assert.Equal(t, http.StatusOK, w.Code)

	// Assert the response body
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)
	assert.Equal(t, "success", response["message"])
}

func TestRoleMiddlewareForbidden(t *testing.T) {
	// Create a new Gin engine
	r := gin.Default()

	// Apply the RoleMiddleware to a test route
	r.GET("/test", middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	// Create a test request with an incorrect role
	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+testUtils.CandidateToken.Raw) // Use a candidate token for testing

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(w, req)

	// Assert the response status code
	assert.Equal(t, http.StatusForbidden, w.Code)

	// Assert the response body
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)
	assert.Equal(t, "Forbidden", response["error"])
}
