package recruiterDto

import (
	"skillly/pkg/handlers/user"
)

type CreateRecruiterDTO struct {
	Title     string    `json:"title"`
	CompanyID uint      `json:"company"`
	User      user.User `json:"user"`
}
