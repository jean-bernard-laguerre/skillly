package jobPost

import (
	"fmt"
	"skillly/pkg/config"
	jobPostDto "skillly/pkg/handlers/jobPost/dto"

	"github.com/gin-gonic/gin"
)

func CreatedJobPost(c *gin.Context) {
	dto := jobPostDto.CreateJobPostDTO{}
	err := c.BindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Get the company from the context
	fmt.Println(c.Keys)
	companyIdValue := c.Keys["company_id"]

	var companyId uint
	switch v := companyIdValue.(type) {
	case float64:
		companyId = uint(companyIdValue.(float64))
	case uint:
		companyId = companyIdValue.(uint)
	default:
		c.JSON(400, gin.H{"error": "Invalid company ID type %v", "value": v})
	}

	// Create the job post
	jobPostRepository := JobPostRepository{}
	jobPost, err := jobPostRepository.Create(dto, companyId, config.DB)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, jobPost)
}
