package file

import (
	"time"
)

// File is a struct that represents a file
type File struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	FileName  string    `json:"file_name"`
	FileType  string    `json:"file_type"`
	FileURL   string    `json:"file_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
