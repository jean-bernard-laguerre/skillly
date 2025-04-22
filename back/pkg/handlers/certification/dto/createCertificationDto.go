package certificationDto

type CreateCertificationDTO struct {
	Name     string `json:"name" binding:"required"`
	Category string `json:"category" binding:"required"`
}
