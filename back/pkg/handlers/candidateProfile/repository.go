package candidate

import (
	"gorm.io/gorm"
	/* "skillly/pkg/config" */
	candidateDto "skillly/pkg/handlers/candidateProfile/dto"
)

// Create a new candidate
func (c *ProfileCandidate) Create(
	dto candidateDto.CreateCandidateDTO, tx *gorm.DB,
) (int, error) {

	profile := ProfileCandidate{
		Bio:              dto.Bio,
		Location:         dto.Location,
		ExperienceYear:   dto.ExperienceYear,
		PreferedContract: dto.PreferedContract,
		PreferedJob:      dto.PreferedJob,
		Availability:     dto.Availability,
		ResumeID:         dto.ResumeID,
		Certifications:   dto.Certifications,
		Skills:           dto.Skills,
		UserID:           dto.User.ID,
	}

	createdCandidate := tx.Create(&profile)
	if createdCandidate.Error != nil {
		return 0, createdCandidate.Error
	}

	return int(profile.ID), nil
}
