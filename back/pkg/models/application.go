package models

import (
	"skillly/pkg/utils"
	"time"
)

const (
	PendingApplication  utils.ApplicationState = "pending"
	MatchedApplication  utils.ApplicationState = "matched"
	RejectedApplication utils.ApplicationState = "rejected"
	ClosedApplication   utils.ApplicationState = "closed"
)

// Application is a struct that represents an application
type Application struct {
	ID        uint                   `json:"id" gorm:"primaryKey"`
	State     utils.ApplicationState `json:"state" gorm:"default:'pending'"`
	Score     int                    `json:"score"`
	CreatedAt time.Time              `json:"created_at"`

	JobPostID uint    `json:"job_post_id"`
	JobPost   JobPost `json:"job_post" gorm:"foreignKey:JobPostID;references:ID"`

	CandidateID uint             `json:"candidate_id"`
	Candidate   ProfileCandidate `json:"candidate" gorm:"foreignKey:CandidateID;references:ID"`

	CoverLetterID uint `json:"cover_id"  gorm:"default:null"`
	CoverLetter   File `json:"cover" gorm:"foreignKey:CoverLetterID;references:ID"`
}
