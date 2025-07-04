package user_test

import (
	"testing"

	"skillly/pkg/config"
	"skillly/pkg/handlers/user"
	userDto "skillly/pkg/handlers/user/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

var userRepo user.UserRepository

func CreateUser(t *testing.T) {
	userRepo = user.NewUserRepository(config.DB)

	// Create a new user
	newUser := userDto.CreateUserDTO{
		Email:     "test@test.com",
		Password:  "password123",
		FirstName: "Test",
		LastName:  "User",
		Role:      models.RoleRecruiter,
	}
	user, err := userRepo.CreateUser(newUser, config.DB)
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}
	// Check if the user is created successfully
	if user.ID == 0 {
		t.Fatalf("Expected user ID to be set, got nil")
	}
	// Check if the user email is correct
	if user.Email != newUser.Email {
		t.Fatalf("Expected user email %s, got %s", newUser.Email, user.Email)
	}
	// Check if the user name is correct
	if user.FirstName != newUser.FirstName {
		t.Fatalf("Expected user name %s, got %s", newUser.FirstName, user.FirstName)
	}
	// Check if the user last name is correct
	if user.LastName != newUser.LastName {
		t.Fatalf("Expected user last name %s, got %s", newUser.LastName, user.LastName)
	}
	// Check if the user password is hashed
	if user.Password == newUser.Password {
		t.Fatalf("User password should be hashed, got %s", user.Password)
	}
}

func GetUserById(t *testing.T) {
	user, err := userRepo.GetByID(1, nil)

	if err != nil {
		t.Fatalf("Failed to get user by ID: %v", err)
	}

	// Check if the user ID is correct
	if user.ID != 1 {
		t.Fatalf("Expected user ID 1, got %d", user.ID)
	}
}

func GetUserByEmail(t *testing.T) {
	user, err := userRepo.GetByEmail("test@test.com")
	if err != nil {
		t.Fatalf("Failed to get user by email: %v", err)
	}

	// Check if the user email is correct
	if user.Email != "test@test.com" {
		t.Fatalf("Expected user email test@test.com, got %s", user.Email)
	}
}

func GetAllUsers(t *testing.T) {
	params := utils.GetUrlParams(nil)
	users, err := userRepo.GetAll(params)
	if err != nil {
		t.Fatalf("Failed to get all users: %v", err)
	}

	// Check if the users slice is not empty
	if len(users) == 0 {
		t.Fatal("Expected at least one user, got none")
	}
}
