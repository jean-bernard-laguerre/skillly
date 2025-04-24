package models

import (
	"errors"
	"time"

	"skillly/pkg/utils"
)

const (
	RoleCandidate utils.RoleType = "candidate"
	RoleRecruiter utils.RoleType = "recruiter"
)

// User is a struct that represents a user
type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	FirstName string         `json:"first_name"`
	LastName  string         `json:"last_name"`
	Email     string         `json:"email"`
	Password  string         `json:"-"`
	Role      utils.RoleType `json:"role"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`

	ProfileCandidate *ProfileCandidate `json:"profile_candidate" gorm:"foreignKey:UserID;references:ID"`
	ProfileRecruiter *ProfileRecruiter `json:"profile_recruiter" gorm:"foreignKey:UserID;references:ID"`
}

func (u *User) ValidateRole() error {
	switch u.Role {
	case RoleCandidate, RoleRecruiter:
		return nil
	default:
		return errors.New("invalid role: must be 'candidate' or 'recruiter'")
	}
}
