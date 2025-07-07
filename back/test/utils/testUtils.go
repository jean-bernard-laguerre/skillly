package testUtils

import (
	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"

	"net/url"
)

func CreateTestContext() *gin.Context {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Set the request method and URL
	c.Request = &http.Request{
		Method: "GET",
		URL:    &url.URL{Path: "/test"},
	}

	return c
}
