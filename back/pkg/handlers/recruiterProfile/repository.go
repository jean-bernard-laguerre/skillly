package recruiter

import (
	"skillly/pkg/config"
	recruiterDto "skillly/pkg/handlers/recruiterProfile/dto"
)

// Create a new recruiter
func (r *ProfileRecruiter) Create(
	dto recruiterDto.CreateRecruiterDTO,
) (int, error) {

	createdRecruiter := config.DB.Create(&ProfileRecruiter{
		Title:     dto.Title,
		CompanyID: dto.CompanyID,
		UserID:    dto.User.ID,
	})

	if createdRecruiter.Error != nil {
		return 0, createdRecruiter.Error
	}

	return int(createdRecruiter.RowsAffected), nil
}
