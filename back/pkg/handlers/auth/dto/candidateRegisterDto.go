package authDto

import (
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/skill"
)

type CandidateRegisterDTO struct {
	FirstName      string                        `json:"firstName" binding:"required"`
	LastName       string                        `json:"lastName" binding:"required"`
	Email          string                        `json:"email" binding:"required"`
	Password       string                        `json:"password" binding:"required"`
	Bio            string                        `json:"bio"`
	ExperienceYear int                           `json:"experienceYears"`
	PreferedJob    string                        `json:"preferedJob"`
	Location       string                        `json:"location"`
	Availability   string                        `json:"availability"`
	ResumeID       uint                          `json:"resumeID"`
	Certifications []certification.Certification `json:"certifications"`
	Skills         []skill.Skill                 `json:"skills"`
}
