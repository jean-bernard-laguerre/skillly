package models

import "skillly/pkg/handlers/user"

// ProfileCandidate is a struct that represents a candidate user
type ProfileCandidate struct {
	ID              uint            `json:"id" gorm:"primaryKey"`
	UserID          uint            `json:"user_id" gorm:"uniqueIndex"` // Clé étrangère vers User
	User            user.UserModel  `json:"user" gorm:"embedded;embeddedPrefix:user_;constraint:OnDelete:CASCADE;"`
	Bio             string          `json:"bio"`
	ExperienceYear  int             `json:"experience_year"`
	PreferedJobType string          `json:"prefered_job_type"`
	Location        string          `json:"location"`
	Availability    string          `json:"availability"`
	ResumeID        uint            `json:"resume_id"` // Ajout de la clé étrangère
	Resume          File            `json:"resume" gorm:"foreignKey:ResumeID;references:ID"`
	Certifications  []Certification `json:"certifications" gorm:"many2many:User_Certifications;constraint:OnDelete:CASCADE;"`
	Skills          []Skill         `json:"skills" gorm:"many2many:User_Skills;constraint:OnDelete:CASCADE;"`
}
