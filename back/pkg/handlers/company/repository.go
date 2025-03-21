package company

import (
	companyDto "skillly/pkg/handlers/company/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type CompanyRepository struct{}

func (r *CompanyRepository) Create(dto companyDto.CreateCompanyDTO, tx *gorm.DB) (models.Company, error) {

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
