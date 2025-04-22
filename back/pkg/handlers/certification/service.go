package certification

import (
	"skillly/pkg/config"
	certificationDto "skillly/pkg/handlers/certification/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

func CreateCertification(c *gin.Context) {
	var dto certificationDto.CreateCertificationDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	tx := config.DB.Begin()
	repo := &CertificationRepository{}
	certification, err := repo.Create(dto, tx)
	if err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Failed to create certification"})
		return
	}
	tx.Commit()

	c.JSON(200, certification)
}

func GetAll(c *gin.Context) {
	params := utils.GetUrlParams(c)
	db := config.DB.Model(&models.Certification{})

	// apply filters
	for key, value := range params.Filters {
		db = db.Where(key, value)
	}

	// apply sorting
	db = db.Order(params.Sort + " " + params.Order)

	// apply pagination
	if params.PageSize != nil {
		db = db.Limit(*params.PageSize).Offset((params.Page - 1) * *params.PageSize)
	}

	// populate fields
	for _, field := range params.Populate {
		db = db.Preload(field)
	}

	var certifications []models.Certification
	db.Find(&certifications)

	c.JSON(200, certifications)
}
