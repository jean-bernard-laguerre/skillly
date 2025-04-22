package candidate

import (
	"gorm.io/gorm"
	/* "skillly/pkg/config" */
	candidateDto "skillly/pkg/handlers/candidateProfile/dto"
	"skillly/pkg/models"
)

type CandidateRepository struct{}

// Create a new candidate
func (r *CandidateRepository) Create(
	dto candidateDto.CreateCandidateDTO, tx *gorm.DB,
) (models.ProfileCandidate, error) {

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
