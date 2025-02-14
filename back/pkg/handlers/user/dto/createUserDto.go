package userDto

import "skillly/pkg/skillly"

type CreateUserDTO struct {
	FirstName string           `json:"firstName" binding:"required"`
	LastName  string           `json:"lastName" binding:"required"`
	Email     string           `json:"email" binding:"required"`
	Password  string           `json:"password" binding:"required"`
	Role      skillly.RoleType `json:"role" binding:"required"`
}
