package certification

import (
	certificationDto "skillly/pkg/handlers/certification/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type CertificationRepository struct{}

func (r *CertificationRepository) Create(dto certificationDto.CreateCertificationDTO, tx *gorm.DB) (models.Certification, error) {
	certification := models.Certification{
		Name:     dto.Name,
		Category: dto.Category,
	}

	createdCertification := tx.Create(&certification)
	if createdCertification.Error != nil {
		return models.Certification{}, createdCertification.Error
	}
	return certification, nil
}
