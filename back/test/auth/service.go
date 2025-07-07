package auth_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"skillly/pkg/handlers/auth"
	"skillly/pkg/models"
	testUtils "skillly/test/utils"

	"github.com/gin-gonic/gin"
)

var authService = auth.NewAuthService()

func RegisterCandidate(t *testing.T) {

	jsonData, err := json.Marshal(testUtils.TestCandidate)
	require.NoError(t, err)

	// Create HTTP request
	req, err := http.NewRequest("POST", "/auth/register/candidate", bytes.NewBuffer(jsonData))
	require.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	// Create Gin context
	c, _ := gin.CreateTestContext(w)
	c.Request = req

	// Call the service method
	authService.RegisterCandidate(c)

	// Assert the response status code
	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	// Verify response contains user and token
	assert.Contains(t, response, "user")
	assert.Contains(t, response, "token")

	// Verify user data
	user := response["user"].(map[string]interface{})
	assert.Equal(t, testUtils.TestCandidate.Email, user["email"])
	assert.Equal(t, testUtils.TestCandidate.FirstName, user["first_name"])
	assert.Equal(t, testUtils.TestCandidate.LastName, user["last_name"])
	assert.Equal(t, string(models.RoleCandidate), user["role"])

	token := response["token"].(string)
	assert.NotEmpty(t, token)
}

func RegisterRecruiter(t *testing.T) {

	jsonData, err := json.Marshal(testUtils.TestRecruiter)
	require.NoError(t, err)

	// Create HTTP request
	req, err := http.NewRequest("POST", "/auth/register/recruiter", bytes.NewBuffer(jsonData))
	require.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	// Create Gin context
	c, _ := gin.CreateTestContext(w)
	c.Request = req

	// Call the service method
	authService.RegisterRecruiter(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	// Verify response contains user and token
	assert.Contains(t, response, "user")
	assert.Contains(t, response, "token")

	// Verify user data
	user := response["user"].(map[string]interface{})
	assert.Equal(t, testUtils.TestRecruiter.Email, user["email"])
	assert.Equal(t, testUtils.TestRecruiter.FirstName, user["first_name"])
	assert.Equal(t, testUtils.TestRecruiter.LastName, user["last_name"])
	assert.Equal(t, string(models.RoleRecruiter), user["role"])

	token := response["token"].(string)
	assert.NotEmpty(t, token)
}
