package models

import (
	"time"
)

// Match is a struct that represents a match
type Match struct {
	ID            uint             `json:"id" gorm:"primaryKey"`
	MatchedAt     time.Time        `json:"matched_at"`
	CandidateID   uint             `json:"candidate_id"`
	Candidate     ProfileCandidate `json:"candidate" gorm:"foreignKey:CandidateID;references:ID"`
	JobPostID     uint             `json:"job_post_id"`
	JobPost       JobPost          `json:"job_post" gorm:"foreignKey:JobPostID;references:ID"`
	ApplicationID uint             `json:"application_id"`
	Application   Application      `json:"application" gorm:"foreignKey:ApplicationID;references:ID"`
}
