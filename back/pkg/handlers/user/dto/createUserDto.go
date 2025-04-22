package userDto

import "skillly/pkg/utils"

type CreateUserDTO struct {
	FirstName string         `json:"firstName" binding:"required"`
	LastName  string         `json:"lastName" binding:"required"`
	Email     string         `json:"email" binding:"required"`
	Password  string         `json:"password" binding:"required"`
	Role      utils.RoleType `json:"role" binding:"required"`
}
