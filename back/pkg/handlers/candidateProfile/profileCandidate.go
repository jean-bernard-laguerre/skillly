package candidate

import (
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/file"
	"skillly/pkg/handlers/skill"
	"skillly/pkg/handlers/user"
)

// ProfileCandidate is a struct that represents a candidate user
type ProfileCandidate struct {
	ID              uint                          `json:"id" gorm:"primaryKey"`
	UserID          uint                          `json:"user_id" gorm:"uniqueIndex"` // Clé étrangère vers User
	User            user.User                     `json:"user" gorm:"embedded;embeddedPrefix:user_;constraint:OnDelete:CASCADE;"`
	Bio             string                        `json:"bio"`
	ExperienceYear  int                           `json:"experience_year"`
	PreferedJobType string                        `json:"prefered_job_type"`
	Location        string                        `json:"location"`
	Availability    string                        `json:"availability"`
	ResumeID        uint                          `json:"resume_id"` // Ajout de la clé étrangère
	Resume          file.File                     `json:"resume" gorm:"foreignKey:ResumeID;references:ID"`
	Certifications  []certification.Certification `json:"certifications" gorm:"many2many:User_Certifications;constraint:OnDelete:CASCADE;"`
	Skills          []skill.Skill                 `json:"skills" gorm:"many2many:User_Skills;constraint:OnDelete:CASCADE;"`
}
