package user

import (
	/* "skillly/pkg/config" */
	"skillly/pkg/config"
	userDto "skillly/pkg/handlers/user/dto"

	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
)

// Create a new user
func (u *User) Create(
	dto userDto.CreateUserDTO, tx *gorm.DB,
) (User, error) {

	// Hash the password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, err
	}

	user := User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
		Password:  string(hashPassword),
		Role:      RoleCandidate,
	}

	createdUser := tx.Create(&user)
	if createdUser.Error != nil {
		return User{}, createdUser.Error
	}

	return user, nil
}

func (u *User) GetByEmail(email string) (User, error) {
	var user User
	result := config.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return User{}, result.Error
	}
	return user, nil
}
