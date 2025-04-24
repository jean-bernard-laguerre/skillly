package company

import (
	"skillly/pkg/config"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

type CompanyService interface {
	GetAll(c *gin.Context)
}

type companyService struct {
	companyRepository CompanyRepository
}

func NewCompanyService() CompanyService {
	return &companyService{
		companyRepository: NewCompanyRepository(config.DB),
	}
}

func (s *companyService) GetAll(
	c *gin.Context,
) {

	params := utils.GetUrlParams(c)
	companies, err := s.companyRepository.GetAll(params)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}

	c.JSON(200, companies)
}
