package models

import (
	"time"
)

// CompanyReview is a struct that represents a company review
type CompanyReview struct {
	ID        uint             `json:"id" gorm:"primaryKey"`
	Comment   string           `json:"comment"`
	Rating    int              `json:"rating"`
	CreatedAt time.Time        `json:"created_at"`
	CompanyID uint             `json:"company_id"`
	Company   Company          `json:"company" gorm:"foreignKey:CompanyID;references:ID"`
	AuthorID  uint             `json:"reviewer_id"`
	Candidate ProfileCandidate `json:"candidate" gorm:"foreignKey:AuthorID;references:ID"`
}
