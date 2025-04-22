package models

import (
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

type CreateRecruiterDTO struct {
	Title     string            `json:"title"`
	CompanyID uint              `json:"company"`
	Role      utils.CompanyRole `json:"role"`
	User      models.User       `json:"user"`
}
