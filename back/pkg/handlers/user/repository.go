package user

import (
	"log"
	"skillly/pkg/config"
	userDto "skillly/pkg/handlers/user/dto"
)

func (u *User) Create(
	dto userDto.CreateUserDTO,
) (int, error) {

	db, err := config.DB.DB()
	if err != nil {
		log.Printf("Error: %s", err)
	}

	err = db.Ping()
	if err != nil {
		log.Printf("Error: %s", err)
	}

	createdUser := config.DB.Create(&User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
		Password:  dto.Password,
		Role:      RoleCandidate,
	})
	if createdUser.Error != nil {
		return 0, createdUser.Error
	}

	log.Printf("User created successfully: %d rows affected", createdUser.RowsAffected)
	return int(createdUser.RowsAffected), nil
}
