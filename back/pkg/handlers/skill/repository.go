package skill

import (
	skillDto "skillly/pkg/handlers/skill/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type SkillRepository interface {
	models.Repository[models.Skill]
	CreateSKill(dto skillDto.CreateSkillDTO, tx *gorm.DB) (models.Skill, error)
}

type skillRepository struct {
	models.Repository[models.Skill]
	db *gorm.DB
}

func NewSkillRepository(db *gorm.DB) SkillRepository {
	return &skillRepository{
		Repository: models.NewRepository[models.Skill](db),
		db:         db,
	}
}

func (r *skillRepository) CreateSKill(dto skillDto.CreateSkillDTO, tx *gorm.DB) (models.Skill, error) {
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
