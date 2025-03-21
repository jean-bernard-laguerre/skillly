package recruiter

import (
	recruiterDto "skillly/pkg/handlers/recruiterProfile/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type RecruiterRepository struct{}

// Create a new recruiter
func (
	r *RecruiterRepository,
) Create(
	dto recruiterDto.CreateRecruiterDTO, tx *gorm.DB,
) (int, error) {

	createdRecruiter := tx.Create(&models.ProfileRecruiter{
		Title:     dto.Title,
		CompanyID: dto.CompanyID,
		UserID:    dto.User.ID,
		Role:      dto.Role,
	})

	if createdRecruiter.Error != nil {
		return 0, createdRecruiter.Error
	}

	return int(createdRecruiter.RowsAffected), nil
}
