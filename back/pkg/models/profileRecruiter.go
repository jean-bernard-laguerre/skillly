package models

import (
	"skillly/pkg/types"
)

const (
	PendingState types.RecruiterState = "pending"
	ActiveState  types.RecruiterState = "active"
)

const (
	AdminRole     types.CompanyRole = "admin"
	RecruiterRole types.CompanyRole = "recruiter"
)

// ProfileRecruter is a struct that represents a recruter user
type ProfileRecruiter struct {
	ID        uint                 `json:"id" gorm:"primaryKey"`
	UserID    uint                 `json:"user_id" gorm:"uniqueIndex"` // Clé étrangère vers User
	User      User                 `json:"user" gorm:"foreignKey:UserID;references:ID"`
	Title     string               `json:"title"`
	Role      types.CompanyRole    `json:"role" gorm:"default:'recruiter'"`
	State     types.RecruiterState `json:"state" gorm:"default:'pending'"`
	CompanyID uint                 `json:"company_id"`
	Company   Company              `json:"company" gorm:"foreignKey:CompanyID;references:ID"`
}
