package match

import (
	matchDto "skillly/pkg/handlers/match/dto"
	"skillly/pkg/models"
	"time"

	"gorm.io/gorm"
)

// MatchRepository defines the interface for match data operations
type MatchRepository interface {
	models.Repository[models.Match]
	CreateMatch(dto matchDto.CreateMatchDTO, tx *gorm.DB) (models.Match, error)
	GetCandidateMatches(candidateID uint) ([]models.Match, error)
	GetRecruiterMatches(recruiterID uint) ([]models.Match, error)
}

type matchRepository struct {
	models.Repository[models.Match]
	db *gorm.DB
}

// NewMatchRepository creates a new instance of MatchRepository
func NewMatchRepository(db *gorm.DB) MatchRepository {
	return &matchRepository{
		Repository: models.NewRepository[models.Match](db),
		db:         db,
	}
}

// CreateMatch inserts a new match record into the database
func (r *matchRepository) CreateMatch(dto matchDto.CreateMatchDTO, tx *gorm.DB) (models.Match, error) {
	match := models.Match{
		CandidateID:   dto.CandidateID,
		JobPostID:     dto.JobPostID,
		ApplicationID: dto.ApplicationID,
		MatchedAt:     time.Now(), // Set the matched time to now
	}

	result := tx.Create(&match)
	if result.Error != nil {
		return models.Match{}, result.Error
	}

	// Preload associated data if needed after creation
	tx.Preload("Candidate.User").
		Preload("Candidate.Skills").
		Preload("Candidate.Certifications").
		Preload("JobPost").
		Preload("Application").
		First(&match, match.ID)

	return match, nil
}

// GetCandidateMatches retrieves all matches for a specific candidate
func (r *matchRepository) GetCandidateMatches(candidateID uint) ([]models.Match, error) {
	var matches []models.Match

	result := r.db.Where("candidate_id = ?", candidateID).
		Preload("Candidate.User").
		Preload("Candidate.Skills").
		Preload("Candidate.Certifications").
		Preload("JobPost.Company").
		Preload("JobPost.Skills").
		Preload("JobPost.Certifications").
		Preload("Application").
		Find(&matches)

	if result.Error != nil {
		return nil, result.Error
	}

	return matches, nil
}

// GetRecruiterMatches retrieves all matches for job posts from the recruiter's company
func (r *matchRepository) GetRecruiterMatches(recruiterID uint) ([]models.Match, error) {
	var matches []models.Match

	// Get the recruiter's company ID and then find all matches for job posts from that company
	result := r.db.Table("matches").
		Select("matches.*").
		Joins("JOIN job_posts ON matches.job_post_id = job_posts.id").
		Joins("JOIN profile_recruiters ON job_posts.company_id = profile_recruiters.company_id").
		Where("profile_recruiters.id = ?", recruiterID).
		Preload("Candidate.User").
		Preload("Candidate.Skills").
		Preload("Candidate.Certifications").
		Preload("JobPost.Company").
		Preload("JobPost.Skills").
		Preload("JobPost.Certifications").
		Preload("Application").
		Find(&matches)

	if result.Error != nil {
		return nil, result.Error
	}

	return matches, nil
}
