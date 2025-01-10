package handlers

import (
	"gorm.io/gorm"
)

// Handler is a struct that represents a handler
type Handler struct {
	DB *gorm.DB
}

// NewHandler creates a new handler
func New(db *gorm.DB) Handler {
	return Handler{DB: db}
}