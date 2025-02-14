package jobPost

import (
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/company"
	"skillly/pkg/handlers/file"
	"skillly/pkg/handlers/skill"
	"time"
)

// JobPost is a struct that represents a job post
type JobPost struct {
	ID              uint                          `json:"id" gorm:"primaryKey"`
	Description     string                        `json:"description"`
	Title           string                        `json:"title"`
	Location        string                        `json:"location"`
	Salary_range    string                        `json:"salary_range"`
	Expiration_Date time.Time                     `json:"expiration_date"`
	CreatedAt       time.Time                     `json:"created_at"`
	FileID          uint                          `json:"file_id"`
	File            file.File                     `json:"file" gorm:"foreignKey:FileID;references:ID"`
	CompanyID       uint                          `json:"company_id"`
	Company         company.Company               `json:"company" gorm:"foreignKey:CompanyID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Certifications  []certification.Certification `json:"certifications" gorm:"many2many:JobPost_Certifications;constraint:OnDelete:CASCADE;"`
	Skills          []skill.Skill                 `json:"skills" gorm:"many2many:JobPost_Skills;constraint:OnDelete:CASCADE;"`
}
