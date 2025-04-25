package applicationDto

// UpdateApplicationStateDTO defines the structure for updating the application state
type UpdateApplicationStateDTO struct {
	State string `json:"state" binding:"required,oneof=pending matched rejected accepted"` // Ensure state is one of the allowed values
}
