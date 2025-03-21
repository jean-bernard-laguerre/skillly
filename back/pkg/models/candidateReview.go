package models

import (
	"time"
)

// CandidateReview is a struct that represents a candidate review
type CandidateReview struct {
	ID          uint             `json:"id" gorm:"primaryKey"`
	Comment     string           `json:"comment"`
	Rating      int              `json:"rating"`
	CreatedAt   time.Time        `json:"created_at"`
	CandidateID uint             `json:"candidate_id"`
	Candidate   ProfileCandidate `json:"candidate" gorm:"foreignKey:CandidateID;references:ID"`
	AuthorID    uint             `json:"author_id"`
	Recruiter   ProfileRecruiter `json:"recruiter" gorm:"foreignKey:AuthorID;references:ID"`
}
