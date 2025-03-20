package recruiter

import (
	"skillly/pkg/handlers/company"
	"skillly/pkg/handlers/user"
	"skillly/pkg/skillly"
)

const (
	PendingState skillly.RecruiterState = "pending"
	ActiveState  skillly.RecruiterState = "active"
)

const (
	AdminRole     skillly.CompanyRole = "admin"
	RecruiterRole skillly.CompanyRole = "recruiter"
)

// ProfileRecruter is a struct that represents a recruter user
type ProfileRecruiter struct {
	ID        uint                   `json:"id" gorm:"primaryKey"`
	UserID    uint                   `json:"user_id" gorm:"uniqueIndex"` // Clé étrangère vers User
	User      user.User              `json:"user" gorm:"foreignKey:UserID;references:ID"`
	Title     string                 `json:"title"`
	Role      skillly.CompanyRole    `json:"role" gorm:"default:'recruiter'"`
	State     skillly.RecruiterState `json:"state" gorm:"default:'pending'"`
	CompanyID uint                   `json:"company_id"`
	Company   company.Company        `json:"company" gorm:"foreignKey:CompanyID;references:ID"`
}
