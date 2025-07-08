package application

import (
	applicationDto "skillly/pkg/handlers/application/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type ApplicationRepository interface {
	models.Repository[models.Application]
	CreateApplication(dto applicationDto.CreateApplicationDTO, tx *gorm.DB) (models.Application, error)
	UpdateApplicationState(applicationID uint, state string, tx *gorm.DB) error
}

type applicationRepository struct {
	models.Repository[models.Application]
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) ApplicationRepository {
	return &applicationRepository{
		Repository: models.NewRepository[models.Application](db),
		db:         db,
	}
}

func (r *applicationRepository) CreateApplication(dto applicationDto.CreateApplicationDTO, tx *gorm.DB) (models.Application, error) {
	application := models.Application{
		CoverLetterID: &dto.CoverLetterID,
		CandidateID:   dto.CandidateID,
		JobPostID:     dto.JobPostID,
		Score:         dto.Score,
	}

	createdApplication := tx.Create(&application)
	if createdApplication.Error != nil {
		return models.Application{}, createdApplication.Error
	}

	return application, nil
}

func (r *applicationRepository) UpdateApplicationState(applicationID uint, state string, tx *gorm.DB) error {
	result := tx.Model(&models.Application{}).Where("id = ?", applicationID).Update("state", state)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // Or a custom error indicating application not found
	}
	return nil
}
