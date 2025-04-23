package user

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"skillly/pkg/config"
	userDto "skillly/pkg/handlers/user/dto"
	"skillly/pkg/models"
)

type UserRepository struct{}

// Create a new user
func (
	r *UserRepository,
) Create(
	dto userDto.CreateUserDTO, tx *gorm.DB,
) (models.User, error) {

	// Hash the password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}

	user := models.User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
		Password:  string(hashPassword),
		Role:      dto.Role,
	}

	createdUser := tx.Create(&user)
	if createdUser.Error != nil {
		return models.User{}, createdUser.Error
	}

	return user, nil
}

func (r *UserRepository) GetByEmail(email string) (models.User, error) {
	var user models.User
	result := config.DB.Preload("ProfileCandidate").Preload("ProfileRecruiter").
		Where("email = ?", email).First(&user)
	if result.Error != nil {
		return models.User{}, result.Error
	}
	return user, nil
}

func (r *UserRepository) GetByID(id uint) (models.User, error) {
	var user models.User
	// Preload associated profiles when fetching by ID
	result := config.DB.Preload("ProfileCandidate").Preload("ProfileRecruiter").
		First(&user, id) // Find user by primary key (ID)
	if result.Error != nil {
		return models.User{}, result.Error
	}
	return user, nil
}
