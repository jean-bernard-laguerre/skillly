package application

import (
	applicationDto "skillly/pkg/handlers/application/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type ApplicationRepository struct{}

func (r *ApplicationRepository) Create(dto applicationDto.CreateApplicationDTO, tx *gorm.DB) (models.Application, error) {
	application := models.Application{
		CoverLetterID: dto.CoverLetterID,
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
