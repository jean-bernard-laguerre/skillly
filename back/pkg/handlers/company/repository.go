package company

import (
	companyDto "skillly/pkg/handlers/company/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type CompanyRepository interface {
	models.Repository[models.Company]
	CreateCompany(dto companyDto.CreateCompanyDTO, tx *gorm.DB) (models.Company, error)
}

type companyRepository struct {
	models.Repository[models.Company]
	db *gorm.DB
}

func NewCompanyRepository(db *gorm.DB) CompanyRepository {
	return &companyRepository{
		Repository: models.NewRepository[models.Company](db),
		db:         db,
	}
}

func (r *companyRepository) CreateCompany(dto companyDto.CreateCompanyDTO, tx *gorm.DB) (models.Company, error) {

	company := models.Company{
		CompanyName: dto.CompanyName,
		SIRET:       dto.SIRET,
		Description: dto.Description,
		Industry:    dto.Industry,
		WebSite:     dto.WebSite,
		Location:    dto.Location,
		Logo:        dto.Logo,
		Size:        dto.Size,
	}

	createdCompany := tx.Create(&company)
	if createdCompany.Error != nil {
		return models.Company{}, createdCompany.Error
	}
	return company, nil
}
