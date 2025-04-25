package certification

import (
	certificationDto "skillly/pkg/handlers/certification/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type CertificationRepository interface {
	models.Repository[models.Certification]
	CreateCertification(dto certificationDto.CreateCertificationDTO, tx *gorm.DB) (models.Certification, error)
}

type certificationRepository struct {
	models.Repository[models.Certification]
	db *gorm.DB
}

func NewCertificationRepository(db *gorm.DB) CertificationRepository {
	return &certificationRepository{
		Repository: models.NewRepository[models.Certification](db),
		db:         db,
	}
}

func (r *certificationRepository) CreateCertification(dto certificationDto.CreateCertificationDTO, tx *gorm.DB) (models.Certification, error) {
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
