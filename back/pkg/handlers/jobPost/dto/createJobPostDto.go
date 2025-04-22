package jobPostDto

import (
	"skillly/pkg/utils"
	"time"
)

type CreateJobPostDTO struct {
	Description     string             `json:"description" binding:"required"`
	Title           string             `json:"title" binding:"required"`
	Location        string             `json:"location" binding:"required"`
	Contract_type   utils.ContractType `json:"contract_type" binding:"required"`
	Salary_range    string             `json:"salary_range" binding:"required"`
	Expiration_Date time.Time          `json:"expiration_date" binding:"required"`
	FileID          uint               `json:"file_id"`

	Certifications []uint `json:"certifications"`
	Skills         []uint `json:"skills"`
}
