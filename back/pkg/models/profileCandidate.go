package models

import (
	"skillly/pkg/types"
)

// ProfileCandidate is a struct that represents a candidate user
type ProfileCandidate struct {
	ID               uint               `json:"id" gorm:"primaryKey"`
	UserID           uint               `json:"user_id" gorm:"uniqueIndex"` // Clé étrangère vers User
	User             User               `json:"user" gorm:"foreignKey:UserID;references:ID"`
	Bio              string             `json:"bio"`
	ExperienceYear   int                `json:"experience_year"`
	PreferedContract types.ContractType `json:"prefered_contract"`
	PreferedJob      string             `json:"prefered_job"`
	Location         string             `json:"location"`
	Availability     string             `json:"availability"`
	ResumeID         uint               `json:"resume_id" gorm:"default:null"` // Ajout de la clé étrangère
	Resume           File               `json:"resume" gorm:"foreignKey:ResumeID;references:ID"`

	Certifications []Certification `json:"certifications" gorm:"many2many:User_Certifications;constraint:OnDelete:CASCADE;"`
	Skills         []Skill         `json:"skills" gorm:"many2many:User_Skills;constraint:OnDelete:CASCADE;"`
}
