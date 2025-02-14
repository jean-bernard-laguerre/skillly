package recruiterDto

import (
	"skillly/pkg/handlers/company"
	"skillly/pkg/handlers/user"
)

type CreateRecruiterDTO struct {
	Title   string          `json:"title"`
	Company company.Company `json:"company"`
	User    user.User       `json:"user"`
}
