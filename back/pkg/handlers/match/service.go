package match

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"

	chatConfig "skillly/chat/config"
	"skillly/chat/models"
	"skillly/pkg/config"
	applicationHandler "skillly/pkg/handlers/application"
	matchDto "skillly/pkg/handlers/match/dto"
	pkgModels "skillly/pkg/models"
)

// MatchService defines the interface for match business logic
type MatchService interface {
	CreateMatch(c *gin.Context)
	GetCandidateMatches(c *gin.Context)
	GetMyMatches(c *gin.Context)
	GetRoomsWithLastMessage(c *gin.Context)
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

// GetMyMatches handles retrieving matches for the authenticated user (candidates or recruiters)
func (s *matchService) GetMyMatches(c *gin.Context) {
	// Get user role and ID from context (set by auth middleware)
	userRole, roleExists := c.Get("user_role")
	if !roleExists {
		c.JSON(403, gin.H{"error": "User role not found in context"})
		return
	}

	roleStr, ok := userRole.(string)
	if !ok {
		c.JSON(500, gin.H{"error": "Invalid user role type"})
		return
	}

	switch roleStr {
	case "candidate":
		// For candidates, use existing logic
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

	case "recruiter":
		// For recruiters, get matches from their company's job posts
		recruiterID, exists := c.Get("recruiter_id")
		if !exists {
			c.JSON(403, gin.H{"error": "Recruiter ID not found in context"})
			return
		}

		recruiterIDUint, ok := recruiterID.(uint)
		if !ok {
			c.JSON(500, gin.H{"error": "Invalid recruiter ID type"})
			return
		}

		// Retrieve matches for recruiter's job posts
		matches, err := s.matchRepository.GetRecruiterMatches(recruiterIDUint)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to retrieve matches: " + err.Error()})
			return
		}

		c.JSON(200, matches)

	default:
		c.JSON(403, gin.H{"error": "Invalid user role"})
		return
	}
}

// GetCandidateMatches handles retrieving matches for the authenticated candidate (kept for compatibility)
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

func (s *matchService) GetRoomsWithLastMessage(c *gin.Context) {
	// Get user role and ID from context (set by auth middleware)
	userRole, roleExists := c.Get("user_role")
	if !roleExists {
		c.JSON(403, gin.H{"error": "User role not found in context"})
		return
	}

	roleStr, ok := userRole.(string)
	if !ok {
		c.JSON(500, gin.H{"error": "Invalid user role type"})
		return
	}

	var matches []pkgModels.Match
	var err error

	switch roleStr {
	case "candidate":
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
		matches, err = s.matchRepository.GetCandidateMatches(candidateIDUint)
	case "recruiter":
		recruiterID, exists := c.Get("recruiter_id")
		if !exists {
			c.JSON(403, gin.H{"error": "Recruiter ID not found in context"})
			return
		}
		recruiterIDUint, ok := recruiterID.(uint)
		if !ok {
			c.JSON(500, gin.H{"error": "Invalid recruiter ID type"})
			return
		}
		matches, err = s.matchRepository.GetRecruiterMatches(recruiterIDUint)
	default:
		c.JSON(403, gin.H{"error": "Invalid user role"})
		return
	}

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to retrieve matches: " + err.Error()})
		return
	}

	// Pour chaque match, récupérer le dernier message MongoDB
	var rooms []map[string]interface{}
	for _, match := range matches {
		roomID := match.ID // Room = ID du match
		var lastMessage map[string]interface{} = nil
		// Query MongoDB pour le dernier message de la room
		collection := chatConfig.DBMongo.Collection("message")
		filter := bson.M{"room": fmt.Sprintf("%v", roomID)} // Forcer string
		opts := options.FindOne().SetSort(bson.D{{"created_at", -1}})
		var msg models.Message
		err := collection.FindOne(context.TODO(), filter, opts).Decode(&msg)
		if err == nil {
			lastMessage = map[string]interface{}{
				"content": msg.Content,
				"sender":  msg.SenderID,
				"sent_at": msg.CreatedAt,
			}
		}
		room := map[string]interface{}{
			"id":         match.ID,
			"name":       match.JobPost.Title,
			"created_at": match.MatchedAt,
			"participants": map[string]interface{}{
				"candidate": match.Candidate,
				"recruiter": match.JobPost.Company,
			},
			"jobPost":     match.JobPost,
			"lastMessage": lastMessage,
		}
		rooms = append(rooms, room)
	}

	c.JSON(200, rooms)
}
