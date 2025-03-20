package companyDto

type CreateCompanyDTO struct {
	CompanyName string `json:"companyName" binding:"required"`
	SIRET       string `json:"siret" binding:"required"`
	Description string `json:"description"`
	Industry    string `json:"industry"`
	WebSite     string `json:"website"`
	Location    string `json:"location"`
	Logo        string `json:"logo"`
	Size        string `json:"size"`
}
