package company

import (
	"skillly/pkg/config"
	companyDto "skillly/pkg/handlers/company/dto"

	"gorm.io/gorm"
)

func (c *Company) Create(dto companyDto.CreateCompanyDTO, tx *gorm.DB) (Company, error) {

	company := Company{
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
		return Company{}, createdCompany.Error
	}
	return company, nil
}

func (c *Company) GetAll() ([]Company, error) {
	var companies []Company
	result := config.DB.Find(&companies)
	if result.Error != nil {
		return []Company{}, result.Error
	}
	return companies, nil
}
