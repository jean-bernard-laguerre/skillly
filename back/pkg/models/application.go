package models

import (
	"time"
)

// Application is a struct that represents an application
type Application struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Status    string    `json:"status"`
	AppliedAt time.Time `json:"Applied_at"`

	JobPostID uint    `json:"job_post_id"`
	JobPost   JobPost `json:"job_post" gorm:"foreignKey:JobPostID;references:ID"`

	CandidateID uint             `json:"candidate_id"`
	Candidate   ProfileCandidate `json:"candidate" gorm:"foreignKey:CandidateID;references:ID"`

	CoverLetterID uint `json:"cover_id"`
	CoverLetter   File `json:"cover" gorm:"foreignKey:CoverLetterID;references:ID"`
}
