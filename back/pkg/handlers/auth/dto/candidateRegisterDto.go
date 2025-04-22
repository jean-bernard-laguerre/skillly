package authDto

import (
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

type CandidateRegisterDTO struct {
	FirstName        string                 `json:"firstName" binding:"required"`
	LastName         string                 `json:"lastName" binding:"required"`
	Email            string                 `json:"email" binding:"required"`
	Password         string                 `json:"password" binding:"required"`
	Bio              string                 `json:"bio"`
	ExperienceYear   int                    `json:"experienceYears"`
	PreferedContract utils.ContractType     `json:"preferedContract"`
	PreferedJob      string                 `json:"preferedJob"`
	Location         string                 `json:"location"`
	Availability     string                 `json:"availability"`
	ResumeID         uint                   `json:"resumeID"`
	Certifications   []models.Certification `json:"certifications"`
	Skills           []models.Skill         `json:"skills"`
}
