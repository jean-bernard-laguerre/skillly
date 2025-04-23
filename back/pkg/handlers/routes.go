package handlers

import (
	"skillly/pkg/handlers/application"
	"skillly/pkg/handlers/auth"
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/company"
	"skillly/pkg/handlers/jobPost"
	"skillly/pkg/handlers/skill"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.Engine) {
	auth.AddRoutes(r)
	company.AddRoutes(r)
	jobPost.AddRoutes(r)
	skill.AddRoutes(r)
	certification.AddRoutes(r)
	application.AddRoutes(r)
}
