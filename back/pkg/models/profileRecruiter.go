package models

import (
	"skillly/pkg/handlers/user"
)

// ProfileRecruter is a struct that represents a recruter user
type ProfileRecruiter struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"uniqueIndex"` // Clé étrangère vers User
	User      user.User `json:"user" gorm:"embedded;embeddedPrefix:user_;constraint:OnDelete:CASCADE;"`
	Title     string    `json:"title"`
	CompanyID uint      `json:"company_id"`
	Company   Company   `json:"company" gorm:"foreignKey:CompanyID;references:ID"`
}
