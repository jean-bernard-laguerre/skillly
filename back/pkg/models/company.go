package models

import (
	"time"
)

// Company is a struct that represents a company
type Company struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	SIRET       string    `json:"siret" gorm:"unique"`
	CompanyName string    `json:"company_name"`
	Description string    `json:"description"`
	Industry    string    `json:"industry"`
	WebSite     string    `json:"web_site"`
	Location    string    `json:"location"`
	Logo        string    `json:"logo"`
	Size        string    `json:"size"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	Recruiters []ProfileRecruiter `json:"recruiters" gorm:"foreignKey:CompanyID;references:ID"`
	Reviews    []CompanyReview    `json:"reviews" gorm:"foreignKey:CompanyID;references:ID"`
	JobPosts   []JobPost          `json:"job_posts" gorm:"foreignKey:CompanyID;references:ID"`
}
