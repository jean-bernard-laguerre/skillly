package certification

import (
	"skillly/pkg/config"
	certificationDto "skillly/pkg/handlers/certification/dto"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

type CertificationService interface {
	CreateCertification(c *gin.Context)
	GetAll(c *gin.Context)
}

type certificationService struct {
	certificationRepository CertificationRepository
}

func NewCertificationService() CertificationService {
	return &certificationService{
		certificationRepository: NewCertificationRepository(config.DB),
	}
}

func (s *certificationService) CreateCertification(c *gin.Context) {
	var dto certificationDto.CreateCertificationDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	tx := config.DB.Begin()

	certification, err := s.certificationRepository.CreateCertification(dto, tx)
	if err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Failed to create certification"})
		return
	}
	tx.Commit()

	c.JSON(200, certification)
}

func (s *certificationService) GetAll(c *gin.Context) {
	params := utils.GetUrlParams(c)
	certifications, err := s.certificationRepository.GetAll(params)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}

	c.JSON(200, certifications)
}
