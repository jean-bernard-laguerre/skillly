package user

import (
	"skillly/pkg/config"
	"skillly/pkg/handlers/user/dto"
)

func (u *UserModel) Create(
	dto dto.CreateUserDTO,
) (int, error) {

	createdUser := config.DB.Create(dto)
	if createdUser.Error != nil {
		return 0, createdUser.Error
	}

	return int(createdUser.RowsAffected), nil
}
