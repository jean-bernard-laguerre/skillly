package jobPost

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/middleware"
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

func AddRoutes(r *gin.Engine) {

	jobPostService := NewJobPostService()

	jp := r.Group("/jobpost")
	jp.POST("/", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		jobPostService.CreateJobPost(c)
	})

	jp.GET("/candidate", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleCandidate), func(c *gin.Context) {
		jobPostService.GetAll(c)
	})

	jp.GET("/company", middleware.AuthMiddleware(), middleware.RoleMiddleware(models.RoleRecruiter), func(c *gin.Context) {
		jobPostService.GetByCompany(c)
	})

	jp.GET("/:id", func(c *gin.Context) {
		params := utils.GetUrlParams(c)
		jobPostId, _ := utils.GetId(c)
		jobpost, _ := jobPostService.GetByID(uint(jobPostId), &params.Populate)
		c.JSON(200, jobpost)
	})

}
