package user_test

import (
	"fmt"
	"testing"

	"skillly/pkg/config"
	"skillly/pkg/handlers/user"
	userDto "skillly/pkg/handlers/user/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"
)

var userRepo = user.NewUserRepository(config.DB)
var context = testUtils.CreateTestContext()
var testUser = models.User{}

func CreateUser(t *testing.T) {

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

	testUser = user // Store the created user for further tests
}

func GetUserById(t *testing.T) {
	fmt.Println("Getting user by ID:", testUser)
	params := utils.GetUrlParams(context)
	user, err := userRepo.GetByID(testUser.ID, &params.Populate)

	if err != nil {
		t.Fatalf("Failed to get user by ID: %v", err)
	}

	// Check if the user ID is correct
	if testUser.ID != user.ID {
		t.Fatalf("Expected user ID %d, got %d", testUser.ID, user.ID)
	}
}

func GetUserByEmail(t *testing.T) {
	user, err := userRepo.GetByEmail(testUser.Email)
	if err != nil {
		t.Fatalf("Failed to get user by email: %v", err)
	}

	// Check if the user email is correct
	if user.Email != testUser.Email {
		t.Fatalf("Expected user email %s, got %s", testUser.Email, user.Email)
	}
}

func UpdateUser(t *testing.T) {
	// Create a new user to update
	params := utils.GetUrlParams(context)

	testUser.FirstName = "Updated"
	err := userRepo.Update(&testUser)

	if err != nil {
		t.Fatalf("Failed to update user: %v", err)
	}

	// Fetch the updated user
	params = utils.GetUrlParams(context)
	updatedUser, err := userRepo.GetByID(testUser.ID, &params.Populate)
	if err != nil {
		t.Fatalf("Failed to get updated user: %v", err)
	}

	// Check if the user first name is updated
	if updatedUser.FirstName != "Updated" {
		t.Fatalf("Expected user first name Updated, got %s", updatedUser.FirstName)
	}
	// Check if the user last name is still the same
	if updatedUser.LastName != "User" {
		t.Fatalf("Expected user last name User, got %s", updatedUser.LastName)
	}
}

func GetAllUsers(t *testing.T) {
	params := utils.GetUrlParams(context)
	users, err := userRepo.GetAll(params)
	if err != nil {
		t.Fatalf("Failed to get all users: %v", err)
	}

	// Check if the users slice is not empty
	if len(users) == 0 {
		t.Fatal("Expected at least one user, got none")
	}
}

func DeleteUser(t *testing.T) {
	err := userRepo.Delete(testUser.ID)
	if err != nil {
		t.Fatalf("Failed to delete user: %v", err)
	}
	// Check if the user is deleted
	_, err = userRepo.GetByID(1, nil)
	if err == nil {
		t.Fatalf("Expected error when getting deleted user, got nil")
	}
	if err.Error() != "record not found" {
		t.Fatalf("Expected 'record not found' error, got %v", err)
	}
}
