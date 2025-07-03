package match

import (
	"strconv"

	"github.com/gin-gonic/gin"

	chatConfig "skillly/chat/config"
	"skillly/chat/handlers/room"
	"skillly/pkg/config"
	applicationHandler "skillly/pkg/handlers/application"
	matchDto "skillly/pkg/handlers/match/dto"
)

// MatchService defines the interface for match business logic
type MatchService interface {
	CreateMatch(c *gin.Context)
	GetCandidateMatches(c *gin.Context)
}

type matchService struct {
	matchRepository       MatchRepository
	applicationRepository applicationHandler.ApplicationRepository // To update application state
	roomRepository        room.RoomRepository                      // To create a room for the match
}

// NewMatchService creates a new instance of MatchService
func NewMatchService() MatchService {
	return &matchService{
		matchRepository:       NewMatchRepository(config.DB),
		applicationRepository: applicationHandler.NewApplicationRepository(config.DB),
		roomRepository:        room.NewRoomRepository(chatConfig.DBMongo), // Initialize the room repository
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

	s.roomRepository.CreateRoom(match.JobPost.Title + "-" + strconv.FormatUint(uint64(match.ID), 10)) // Create a room for the match

	c.JSON(201, match) // Return 201 Created status with the created match
}

// GetCandidateMatches handles retrieving matches for the authenticated candidate
func (s *matchService) GetCandidateMatches(c *gin.Context) {
	// Get candidate ID from context (set by auth middleware)
	candidateID, exists := c.Get("candidate_id")
	if !exists {
		c.JSON(403, gin.H{"error": "Candidate ID not found in context"})
		return
	}

	candidateIDUint, ok := candidateID.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Invalid candidate ID type"})
		return
	}

	// Retrieve matches from repository
	matches, err := s.matchRepository.GetCandidateMatches(candidateIDUint)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to retrieve matches: " + err.Error()})
		return
	}

	c.JSON(200, matches)
}
