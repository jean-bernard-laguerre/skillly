package jobPost

import (
	"fmt"
	"skillly/pkg/config"
	jobPostDto "skillly/pkg/handlers/jobPost/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

type JobPostService interface {
	CreateJobPost(c *gin.Context)
	GetAll(c *gin.Context)
	GetByCompany(c *gin.Context)
	GetByID(id uint, populate *[]string) (models.JobPost, error)
	// Add other service methods as needed (e.g., UpdateJobPost, DeleteJobPost)
}

type jobPostService struct {
	jobPostRepository JobPostRepository
}

func NewJobPostService() JobPostService {
	return &jobPostService{
		jobPostRepository: NewJobPostRepository(config.DB),
	}
}

func (s *jobPostService) CreateJobPost(c *gin.Context) {
	dto := jobPostDto.CreateJobPostDTO{}
	err := c.BindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Get the company from the context
	companyId := c.Keys["company_id"]

	// Create the job post
	dto.CompanyID = companyId.(uint)
	jobPost, err := s.jobPostRepository.CreateJobPost(dto, config.DB)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, jobPost)
}

func (s *jobPostService) GetAll(c *gin.Context) {
	params := utils.GetUrlParams(c)
	jobPosts, err := s.jobPostRepository.GetAll(params)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}

	c.JSON(200, jobPosts)
}

func (s *jobPostService) GetByCompany(c *gin.Context) {
	fmt.Println("test")
	params := utils.GetUrlParams(c)
	query := config.DB.Model(&models.JobPost{})

	companyId := c.Keys["company_id"]
	fmt.Println(companyId.(uint))

	query = query.Where("company_id", companyId.(uint))
	query = query.Order(params.Sort + " " + params.Order)
	if params.PageSize != nil {
		query = query.Limit(*params.PageSize).Offset((params.Page - 1) * *params.PageSize)
	}

	for _, field := range params.Populate {
		query = query.Preload(field)
	}

	var jobPosts []models.JobPost
	query.Find(&jobPosts)

	c.JSON(200, jobPosts)
}

func (s *jobPostService) GetByID(id uint, populate *[]string) (models.JobPost, error) {
	jobPost, err := s.jobPostRepository.GetByID(id, populate)

	if err != nil {
		return models.JobPost{}, err
	}

	return jobPost, nil
}
