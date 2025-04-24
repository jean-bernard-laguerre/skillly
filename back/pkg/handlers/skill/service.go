package skill

import (
	"github.com/gin-gonic/gin"

	"skillly/pkg/config"
	skillDto "skillly/pkg/handlers/skill/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

func CreateSkill(
	c *gin.Context,
) {
	dto := skillDto.CreateSkillDTO{}
	err := c.BindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	skillRepository := SkillRepository{}
	skill, err := skillRepository.Create(dto, config.DB)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, skill)
}

func GetAll(
	c *gin.Context,
) {
	params := utils.GetUrlParams(c)
	db := config.DB.Model(&models.Skill{})

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

	var skills []models.Skill
	db.Find(&skills)

	c.JSON(200, skills)
}
