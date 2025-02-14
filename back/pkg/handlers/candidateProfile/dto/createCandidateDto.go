package candidateDto

import (
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/skill"
	"skillly/pkg/handlers/user"
)

type CreateCandidateDTO struct {
	Bio             string                        `json:"bio"`
	Location        string                        `json:"location"`
	ExperienceYear  int                           `json:"experience_year"`
	PreferedJobType string                        `json:"prefered_job_type"`
	Availability    string                        `json:"availability"`
	ResumeID        uint                          `json:"resume_id"`
	Certifications  []certification.Certification `json:"certifications"`
	Skills          []skill.Skill                 `json:"skills"`
	User            user.User                     `json:"user"`
}
