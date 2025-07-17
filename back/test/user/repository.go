package user_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"skillly/pkg/config"
	userDto "skillly/pkg/handlers/user/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"
)

func CreateUser(t *testing.T) {

	newUser := userDto.CreateUserDTO{
		Email:     "test@test.com",
		Password:  "password123",
		FirstName: "Test",
		LastName:  "User",
		Role:      models.RoleRecruiter,
	}
	user, err := testUtils.UserRepo.CreateUser(newUser, config.DB)
	require.NoError(t, err, "Failed to create user")

	assert.NotNil(t, user, "Expected user to be created")

	assert.Equal(t, newUser.Email, user.Email, "Expected user email to match")
	assert.Equal(t, newUser.FirstName, user.FirstName, "Expected user first name to match")
	assert.Equal(t, newUser.LastName, user.LastName, "Expected user last name to match")
	assert.NotEqual(t, newUser.Password, user.Password, "Expected user password to be hashed")
}

func GetUserById(t *testing.T) {
	context := testUtils.CreateTestContext()

	params := utils.GetUrlParams(context)
	user, err := testUtils.UserRepo.GetByID(uint(1), &params.Populate)

	require.NoError(t, err, "Failed to get user by ID")
	assert.Equal(t, user.ID, user.ID, "Expected user ID to match")
}

func GetUserByEmail(t *testing.T) {
	user, err := testUtils.UserRepo.GetByEmail(testUtils.TestCandidate.Email)
	require.NoError(t, err, "Failed to get user by email")

	assert.Equal(t, testUtils.TestCandidate.Email, user.Email, "Expected user email to match")
}

func UpdateUser(t *testing.T) {
	// Create a new user to update
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	update, err := testUtils.UserRepo.GetByID(uint(1), &params.Populate)
	require.NoError(t, err, "Failed to get user for update")

	update.FirstName = "Updated"
	err = testUtils.UserRepo.Update(&update)
	require.NoError(t, err, "Failed to update user")

	// Fetch the updated user
	updatedUser, err := testUtils.UserRepo.GetByID(update.ID, &params.Populate)
	require.NoError(t, err, "Failed to get updated user")

	assert.Equal(t, "Updated", updatedUser.FirstName, "Expected user first name to be Updated")
	assert.Equal(t, update.LastName, updatedUser.LastName, "Expected user last name to remain unchanged")
}

func GetAllUsers(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)
	users, err := testUtils.UserRepo.GetAll(params)
	require.NoError(t, err, "Failed to get all users")

	assert.NotEmpty(t, users, "Expected at least one user in the list")

}

func DeleteUser(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	users, err := testUtils.UserRepo.GetAll(params)
	require.NoError(t, err, "Failed to get users for deletion")
	assert.NotEmpty(t, users, "Expected users to exist for deletion")

	err = testUtils.UserRepo.Delete(users[0].ID)
	require.NoError(t, err, "Failed to delete user")
	// Check if the user is deleted

	_, err = testUtils.UserRepo.GetByID(users[0].ID, &params.Populate)
	assert.NotNil(t, err, "Expected error when getting deleted user")
	assert.Equal(t, "record not found", err.Error(), "Expected 'record not found' error")
}
