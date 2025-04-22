package models

import (
	"skillly/pkg/utils"
)

const (
	PendingState utils.RecruiterState = "pending"
	ActiveState  utils.RecruiterState = "active"
)

const (
	AdminRole     utils.CompanyRole = "admin"
	RecruiterRole utils.CompanyRole = "recruiter"
)

// ProfileRecruter is a struct that represents a recruter user
type ProfileRecruiter struct {
	ID        uint                 `json:"id" gorm:"primaryKey"`
	UserID    uint                 `json:"user_id" gorm:"uniqueIndex"` // Clé étrangère vers User
	User      User                 `json:"user" gorm:"foreignKey:UserID;references:ID"`
	Title     string               `json:"title"`
	Role      utils.CompanyRole    `json:"role" gorm:"default:'recruiter'"`
	State     utils.RecruiterState `json:"state" gorm:"default:'pending'"`
	CompanyID uint                 `json:"company_id"`
	Company   Company              `json:"company" gorm:"foreignKey:CompanyID;references:ID"`
}
