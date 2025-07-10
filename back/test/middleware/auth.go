package middleware_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"skillly/pkg/middleware"
	testUtils "skillly/test/utils"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAuthMiddleware(t *testing.T) {

	// Create a new Gin engine
	r := gin.Default()

	// Apply the AuthMiddleware to a test route
	r.GET("/test", middleware.AuthMiddleware(), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	// Create a test request
	req, _ := http.NewRequest("GET", "/test", nil)
	token, _ := testUtils.CandidateToken.SignedString([]byte("secret"))
	req.Header.Set("Authorization", "Bearer "+token) // Use a valid token for testing

	fmt.Println("req.Header", req.Header)
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

func TestAuthMiddlewareUnauthorized(t *testing.T) {
	// Create a new Gin engine
	r := gin.Default()

	// Apply the AuthMiddleware to a test route
	r.GET("/test", middleware.AuthMiddleware(), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	// Create a test request without an Authorization header
	req, _ := http.NewRequest("GET", "/test", nil)

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(w, req)

	// Assert the response status code
	assert.Equal(t, http.StatusUnauthorized, w.Code)

	// Assert the response body
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)
	assert.Equal(t, "Unauthorized", response["error"])
}
