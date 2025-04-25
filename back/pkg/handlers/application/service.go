package application

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"skillly/pkg/config"
	applicationDto "skillly/pkg/handlers/application/dto"
	"skillly/pkg/handlers/jobPost"
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

type ApplicationService interface {
	CreateApplication(c *gin.Context)
	GetMe(c *gin.Context)
	GetOfferApplications(c *gin.Context)
	UpdateApplicationState(c *gin.Context)
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

	jobpost, err := s.jobPostRepository.GetByID(jobPostId, &params.Populate)
	if err != nil {
		c.JSON(404, gin.H{"error": "Job post not found"})
		return
	}
	companyId := c.Keys["company_id"]

	if jobpost.CompanyID != companyId.(uint) {
		c.JSON(403, gin.H{"error": "Forbidden"})
		return
	}

	query.Where("job_post_id = ?", jobPostId)
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

func (s *applicationService) UpdateApplicationState(c *gin.Context) {
	applicationID, err := utils.GetId(c)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid application ID"})
		return
	}

	dto := applicationDto.UpdateApplicationStateDTO{}
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	// TODO: Add authorization check: Ensure the recruiter making the request
	// has the right to modify this specific application (e.g., by checking
	// if the application belongs to a job post owned by their company).
	// This might involve fetching the application and checking its job_post relationship.

	// Using a transaction, although potentially overkill if it's the only operation.
	tx := config.DB.Begin()
	if tx.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to start transaction"})
		return
	}

	err = s.applicationRepository.UpdateApplicationState(applicationID, dto.State, tx)
	if err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			c.JSON(404, gin.H{"error": "Application not found"})
		} else {
			c.JSON(500, gin.H{"error": "Failed to update application state: " + err.Error()})
		}
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Failed to commit transaction: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Application state updated successfully"})
}
