package models

import (
	"skillly/pkg/models"
	"skillly/pkg/types"
)

type CreateRecruiterDTO struct {
	Title     string            `json:"title"`
	CompanyID uint              `json:"company"`
	Role      types.CompanyRole `json:"role"`
	User      models.User       `json:"user"`
}
