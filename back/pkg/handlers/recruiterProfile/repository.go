package recruiter

import (
	recruiterDto "skillly/pkg/handlers/recruiterProfile/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type RecruiterRepository interface {
	models.Repository[models.ProfileRecruiter]
	CreateRecruiter(dto recruiterDto.CreateRecruiterDTO, tx *gorm.DB) (models.ProfileRecruiter, error)
}

type recruiterRepository struct {
	models.Repository[models.ProfileRecruiter]
	db *gorm.DB
}

func NewRecruiterRepository(db *gorm.DB) RecruiterRepository {
	return &recruiterRepository{
		Repository: models.NewRepository[models.ProfileRecruiter](db),
		db:         db,
	}
}

// Create a new recruiter
func (r *recruiterRepository) CreateRecruiter(dto recruiterDto.CreateRecruiterDTO, tx *gorm.DB) (models.ProfileRecruiter, error) {

	recruiter := models.ProfileRecruiter{
		Title:     dto.Title,
		CompanyID: dto.CompanyID,
		UserID:    dto.User.ID,
		Role:      dto.Role,
	}

	createdRecruiter := tx.Create(&recruiter)

	if createdRecruiter.Error != nil {
		return models.ProfileRecruiter{}, createdRecruiter.Error
	}

	return recruiter, nil
}
