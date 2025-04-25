package match

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/config"
	applicationHandler "skillly/pkg/handlers/application"
	matchDto "skillly/pkg/handlers/match/dto"
)

// MatchService defines the interface for match business logic
type MatchService interface {
	CreateMatch(c *gin.Context)
}

type matchService struct {
	matchRepository       MatchRepository
	applicationRepository applicationHandler.ApplicationRepository // To update application state
}

// NewMatchService creates a new instance of MatchService
func NewMatchService() MatchService {
	return &matchService{
		matchRepository:       NewMatchRepository(config.DB),
		applicationRepository: applicationHandler.NewApplicationRepository(config.DB),
	}
}

// CreateMatch handles the creation of a new match
func (s *matchService) CreateMatch(c *gin.Context) {
	dto := matchDto.CreateMatchDTO{}
	err := c.ShouldBindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	// Check if the recruiter is authorized to create a match for this job post
	// (Implicitly checked by middleware ensuring they own the company associated with the job post,
	// but could add explicit check here if needed)

	// Start a transaction
	tx := config.DB.Begin()
	if tx.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to start transaction"})
		return
	}

	// 1. Create the match
	match, err := s.matchRepository.CreateMatch(dto, tx)
	if err != nil {
		tx.Rollback()
		c.JSON(400, gin.H{"error": "Failed to create match: " + err.Error()})
		return
	}

	// 2. Update the application state to "matched"
	err = s.applicationRepository.UpdateApplicationState(dto.ApplicationID, "matched", tx)
	if err != nil {
		tx.Rollback()
		c.JSON(400, gin.H{"error": "Failed to update application state: " + err.Error()})
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback() // Ensure rollback on commit error
		c.JSON(500, gin.H{"error": "Failed to commit transaction: " + err.Error()})
		return
	}

	c.JSON(201, match) // Return 201 Created status with the created match
}
