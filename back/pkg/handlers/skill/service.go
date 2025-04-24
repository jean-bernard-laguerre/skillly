package skill

import (
	"skillly/pkg/config"
	skillDto "skillly/pkg/handlers/skill/dto"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

type SkillService interface {
	CreateSkill(c *gin.Context)
	GetAll(c *gin.Context)
}

type skillService struct {
	skillRepository SkillRepository
}

func NewSkillService() SkillService {
	return &skillService{
		skillRepository: NewSkillRepository(config.DB),
	}
}

func (s *skillService) CreateSkill(c *gin.Context) {
	dto := skillDto.CreateSkillDTO{}
	err := c.BindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	skill, err := s.skillRepository.CreateSKill(dto, config.DB)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, skill)
}

func (s *skillService) GetAll(c *gin.Context) {
	params := utils.GetUrlParams(c)
	skills, err := s.skillRepository.GetAll(params)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}

	c.JSON(200, skills)
}
