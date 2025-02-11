package models

// ProfileRecruter is a struct that represents a recruter user
type ProfileRecruiter struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	User     User   `json:"user" gorm:"embedded;embeddedPrefix:user_"`
	Title	  string `json:"title"`
	Company  Company `json:"company" gorm:"embedded;embeddedPrefix:company_"`
}