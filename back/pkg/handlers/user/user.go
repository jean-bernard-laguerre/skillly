package user

import (
	"errors"
	"time"
)

// RoleType defines the available roles for a user
type RoleType string

const (
	RoleCandidate RoleType = "candidate"
	RoleRecruiter RoleType = "recruiter"
)

// User is a struct that represents a user
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Role      RoleType  `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (u *User) ValidateRole() error {
	switch u.Role {
	case RoleCandidate, RoleRecruiter:
		return nil
	default:
		return errors.New("invalid role: must be 'candidate' or 'recruiter'")
	}
}
