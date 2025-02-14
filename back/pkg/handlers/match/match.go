package match

import (
	candidate "skillly/pkg/handlers/candidateProfile"
	"skillly/pkg/handlers/jobPost"
	"time"
)

// Match is a struct that represents a match
type Match struct {
	ID          uint                       `json:"id" gorm:"primaryKey"`
	IsLiked     bool                       `json:"is_liked"`
	IsMatched   bool                       `json:"is_matched"`
	MatchedAt   time.Time                  `json:"matched_at"`
	CandidateID uint                       `json:"candidate_id"`
	Candidate   candidate.ProfileCandidate `json:"candidate" gorm:"foreignKey:CandidateID;references:ID"`
	JobPostID   uint                       `json:"job_post_id"`
	JobPost     jobPost.JobPost            `json:"job_post" gorm:"foreignKey:JobPostID;references:ID"`
}
