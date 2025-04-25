package candidate

import (
	"gorm.io/gorm"
	/* "skillly/pkg/config" */
	candidateDto "skillly/pkg/handlers/candidateProfile/dto"
	"skillly/pkg/models"
)

type CandidateRepository interface {
	models.Repository[models.ProfileCandidate]
	CreateCandidate(dto candidateDto.CreateCandidateDTO, tx *gorm.DB) (models.ProfileCandidate, error)
	SaveCandidateSkills(id uint, dto candidateDto.UpdateUserSkillsDTO) error
	DeleteCandidateSkills(id uint, dto candidateDto.UpdateUserSkillsDTO) error
}

type candidateRepository struct {
	models.Repository[models.ProfileCandidate]
	db *gorm.DB
}

func NewCandidateRepository(db *gorm.DB) CandidateRepository {
	return &candidateRepository{
		Repository: models.NewRepository[models.ProfileCandidate](db),
		db:         db,
	}
}

// Create a new candidate
func (r *candidateRepository) CreateCandidate(dto candidateDto.CreateCandidateDTO, tx *gorm.DB) (models.ProfileCandidate, error) {

	profile := models.ProfileCandidate{
		Bio:              dto.Bio,
		Location:         dto.Location,
		ExperienceYear:   dto.ExperienceYear,
		PreferedContract: dto.PreferedContract,
		PreferedJob:      dto.PreferedJob,
		Availability:     dto.Availability,
		ResumeID:         dto.ResumeID,
		UserID:           dto.User.ID,
	}

	createdCandidate := tx.Create(&profile)
	if createdCandidate.Error != nil {
		return models.ProfileCandidate{}, createdCandidate.Error
	}

	if len(dto.Skills) > 0 {
		var skills []models.Skill
		if err := tx.Where("id IN ?", dto.Skills).Find(&skills).Error; err != nil {
			return models.ProfileCandidate{}, err
		}

		if err := tx.Model(&profile).Association("Skills").Replace(skills); err != nil {
			return models.ProfileCandidate{}, err
		}
	}

	if len(dto.Certifications) > 0 {
		var certifications []models.Certification
		if err := tx.Where("id IN ?", dto.Certifications).Find(&certifications).Error; err != nil {
			return models.ProfileCandidate{}, err
		}

		if err := tx.Model(&profile).Association("Certifications").Replace(certifications); err != nil {
			return models.ProfileCandidate{}, err
		}
	}

	return profile, nil
}

func (r *candidateRepository) SaveCandidateSkills(id uint, dto candidateDto.UpdateUserSkillsDTO) error {
	candidate, err := r.Repository.GetByID(uint(id), nil)
	if err != nil {
		return err
	}

	if len(dto.Skills) > 0 {
		var skills []models.Skill
		if err := r.db.Where("id IN ?", dto.Skills).Find(&skills).Error; err != nil {
			return err
		}
		if err := r.db.Model(&candidate).Association("Certifications").Append(skills); err != nil {
			return err
		}
	}

	if len(dto.Certifications) > 0 {
		var certifications []models.Certification
		if err := r.db.Where("id IN ?", dto.Certifications).Find(&certifications).Error; err != nil {
			return err
		}

		if err := r.db.Model(&candidate).Association("Certifications").Append(certifications); err != nil {
			return err
		}
	}

	return nil
}

func (r *candidateRepository) DeleteCandidateSkills(id uint, dto candidateDto.UpdateUserSkillsDTO) error {
	candidate, err := r.Repository.GetByID(uint(id), nil)
	if err != nil {
		return err
	}

	if len(dto.Skills) > 0 {
		var skills []models.Skill
		if err := r.db.Where("id IN ?", dto.Skills).Find(&skills).Error; err != nil {
			return err
		}
		if err := r.db.Model(&candidate).Association("Certifications").Delete(skills); err != nil {
			return err
		}
	}

	if len(dto.Certifications) > 0 {
		var certifications []models.Certification
		if err := r.db.Where("id IN ?", dto.Certifications).Find(&certifications).Error; err != nil {
			return err
		}

		if err := r.db.Model(&candidate).Association("Certifications").Delete(certifications); err != nil {
			return err
		}
	}

	return nil
}
