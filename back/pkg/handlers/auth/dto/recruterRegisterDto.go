package authDto

import companyDto "skillly/pkg/handlers/company/dto"

type RecruterRegisterDTO struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	Title     string `json:"title"`
	Company   uint   `json:"company"`

	NewCompany *companyDto.CreateCompanyDTO `json:"newCompany"`
}
