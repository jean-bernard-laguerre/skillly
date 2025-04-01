package jobPost

import (
	"fmt"
	"skillly/pkg/config"
	jobPostDto "skillly/pkg/handlers/jobPost/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

func CreateJobPost(c *gin.Context) {
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

func GetAll(c *gin.Context) {
	params := utils.GetUrlParams(c)
	db := config.DB.Model(&models.JobPost{})

	for key, value := range params.Filters {
		db = db.Where(key, value)
	}

	// apply sorting
	db = db.Order(params.Sort + " " + params.Order)

	// apply pagination
	if params.PageSize != nil {
		db = db.Limit(*params.PageSize).Offset((params.Page - 1) * *params.PageSize)
	}

	// populate fields
	for _, field := range params.Populate {
		db = db.Preload(field)
	}

	var jobPosts []models.JobPost
	db.Find(&jobPosts)

	c.JSON(200, jobPosts)
}
