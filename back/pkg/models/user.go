package models

import (
	"time"
)

// User is a struct that represents a user
type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role	 string `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}