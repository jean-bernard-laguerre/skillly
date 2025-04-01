package candidateDto

import (
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

type CreateCandidateDTO struct {
	Bio              string                 `json:"bio"`
	Location         string                 `json:"location"`
	ExperienceYear   int                    `json:"experience_year"`
	PreferedContract utils.ContractType     `json:"prefered_contract"`
	PreferedJob      string                 `json:"prefered_job"`
	Availability     string                 `json:"availability"`
	ResumeID         uint                   `json:"resume_id"`
	Certifications   []models.Certification `json:"certifications"`
	Skills           []models.Skill         `json:"skills"`
	User             models.User            `json:"user"`
}
