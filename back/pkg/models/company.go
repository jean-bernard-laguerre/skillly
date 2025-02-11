package models

import (
	"time"
)

// Company is a struct that represents a company
type Company struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	CompanyName string `json:"company_name"`
	Description string `json:"description"`
	Industry string `json:"industry"`
	WebSite string `json:"web_site"`
	Location string `json:"location"`
	Logo string `json:"logo"`
	Size string `json:"size"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}