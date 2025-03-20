package recruiterDto

import (
	"skillly/pkg/handlers/user"
	"skillly/pkg/skillly"
)

type CreateRecruiterDTO struct {
	Title     string              `json:"title"`
	CompanyID uint                `json:"company"`
	Role      skillly.CompanyRole `json:"role"`
	User      user.User           `json:"user"`
}
