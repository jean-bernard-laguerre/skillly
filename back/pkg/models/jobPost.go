package models

import (
	"skillly/pkg/types"
	"time"
)

// JobPost is a struct that represents a job post
type JobPost struct {
	ID              uint               `json:"id" gorm:"primaryKey"`
	Description     string             `json:"description"`
	Title           string             `json:"title"`
	Location        string             `json:"location"`
	Contract_type   types.ContractType `json:"contract_type"`
	Salary_range    string             `json:"salary_range"`
	Expiration_Date time.Time          `json:"expiration_date"`
	CreatedAt       time.Time          `json:"created_at"`
	FileID          uint               `json:"file_id"`
	File            File               `json:"file" gorm:"foreignKey:FileID;references:ID"`
	CompanyID       uint               `json:"company_id"`
	Company         Company            `json:"company" gorm:"foreignKey:CompanyID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Certifications  []Certification    `json:"certifications" gorm:"many2many:JobPost_Certifications;constraint:OnDelete:CASCADE;"`
	Skills          []Skill            `json:"skills" gorm:"many2many:JobPost_Skills;constraint:OnDelete:CASCADE;"`
}
