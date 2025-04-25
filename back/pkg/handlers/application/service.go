package application

import (
	"skillly/pkg/config"
	applicationDto "skillly/pkg/handlers/application/dto"
	"skillly/pkg/handlers/jobPost"
	"skillly/pkg/models"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

type ApplicationService interface {
	CreateApplication(c *gin.Context)
	GetMe(c *gin.Context)
	GetOfferApplications(c *gin.Context)
}

type applicationService struct {
	applicationRepository ApplicationRepository
	jobPostRepository     jobPost.JobPostRepository
}

func NewApplicationService() ApplicationService {
	return &applicationService{
		applicationRepository: NewApplicationRepository(config.DB),
		jobPostRepository:     jobPost.NewJobPostRepository(config.DB),
	}
}

func (s *applicationService) CreateApplication(c *gin.Context) {
	dto := applicationDto.CreateApplicationDTO{}
	err := c.BindJSON(&dto)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	jobPostId, _ := utils.GetId(c)
	candidateId := c.Keys["candidate_id"]

	dto.JobPostID = jobPostId
	dto.CandidateID = candidateId.(uint)
	application, err := s.applicationRepository.CreateApplication(dto, config.DB)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, application)
}

func (s *applicationService) GetMe(c *gin.Context) {
	params := utils.GetUrlParams(c)
	query := config.DB.Model(&models.Application{})

	query.Where("candidate_id = ?", c.Keys["candidate_id"])

	// apply sorting
	query = query.Order(params.Sort + " " + params.Order)

	// populate fields
	for _, field := range params.Populate {
		query = query.Preload(field)
	}

	var applications []models.Application
	query.Find(&applications)

	c.JSON(200, applications)
}

func (s *applicationService) GetOfferApplications(c *gin.Context) {

	params := utils.GetUrlParams(c)
	query := config.DB.Model(&models.Application{})

	jobPostId, _ := utils.GetId(c)

	jobpost, _ := s.jobPostRepository.GetByID(jobPostId, nil)
	companyId := c.Keys["company_id"]

	if jobpost.CompanyID != companyId.(uint) {
		c.JSON(400, gin.H{"error": "Unauthorized"})
		return
	}

	query.Where("job_post_id", jobPostId)
	// apply sorting
	query = query.Order(params.Sort + " " + params.Order)

	// apply pagination
	if params.PageSize != nil {
		query = query.Limit(*params.PageSize).Offset((params.Page - 1) * *params.PageSize)
	}

	// populate fields
	for _, field := range params.Populate {
		query = query.Preload(field)
	}

	var applications []models.Application
	query.Find(&applications)

	c.JSON(200, applications)
}
