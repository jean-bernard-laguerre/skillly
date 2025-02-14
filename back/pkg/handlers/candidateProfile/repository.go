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

	createdCandidate := tx.Create(&ProfileCandidate{
		Bio:             dto.Bio,
		Location:        dto.Location,
		ExperienceYear:  dto.ExperienceYear,
		PreferedJobType: dto.PreferedJobType,
		Availability:    dto.Availability,
		ResumeID:        dto.ResumeID,
		Certifications:  dto.Certifications,
		Skills:          dto.Skills,
		User:            dto.User,
	})
	if createdCandidate.Error != nil {
		return 0, createdCandidate.Error
	}

	return int(createdCandidate.RowsAffected), nil
}
