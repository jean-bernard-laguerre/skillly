package skill

import (
	skillDto "skillly/pkg/handlers/skill/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type SkillRepository struct{}

func (r *SkillRepository) Create(dto skillDto.CreateSkillDTO, tx *gorm.DB) (models.Skill, error) {
	skill := models.Skill{
		Name:     dto.Name,
		Category: dto.Category,
	}

	createdSkill := tx.Create(&skill)
	if createdSkill.Error != nil {
		return models.Skill{}, createdSkill.Error
	}
	return skill, nil
}
