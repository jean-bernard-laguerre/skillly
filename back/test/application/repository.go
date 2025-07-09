package application__test

import (
	"testing"

	"skillly/pkg/config"
	applicationDto "skillly/pkg/handlers/application/dto"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func CreateApplication(t *testing.T) {
	// Create a new application
	newApplication := applicationDto.CreateApplicationDTO{
		JobPostID:   1, // Assuming job post with ID 1 exists
		CandidateID: 1, // Assuming candidate with ID 1 exists
		Score:       85,
	}

	application, err := testUtils.ApplicationRepo.CreateApplication(newApplication, config.DB)
	require.NoError(t, err, "Failed to create application")

	assert.NotNil(t, application, "Expected application to be created")
	assert.Equal(t, newApplication.JobPostID, application.JobPostID, "Expected job post ID to match")
	assert.Equal(t, newApplication.CandidateID, application.CandidateID, "Expected candidate ID to match")
	assert.Equal(t, newApplication.Score, application.Score, "Expected score to match")
}

func GetApplicationById(t *testing.T) {
	context := testUtils.CreateTestContext()

	params := utils.GetUrlParams(context)
	application, err := testUtils.ApplicationRepo.GetByID(uint(1), &params.Populate)

	require.NoError(t, err, "Failed to get application by ID")
	assert.Equal(t, uint(1), application.ID, "Expected application ID to match")
}

func UpdateApplication(t *testing.T) {
	// Create a new application to update
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	update, err := testUtils.ApplicationRepo.GetByID(uint(1), &params.Populate)
	require.NoError(t, err, "Failed to get application for update")

	update.Score = 90
	err = testUtils.ApplicationRepo.Update(&update)
	require.NoError(t, err, "Failed to update application")

	// Fetch the updated application
	updatedApplication, err := testUtils.ApplicationRepo.GetByID(update.ID, &params.Populate)
	require.NoError(t, err, "Failed to get updated application")

	assert.Equal(t, update.Score, updatedApplication.Score, "Expected updated application score to match")
}

func DeleteApplication(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	applications, err := testUtils.ApplicationRepo.GetAll(params)
	require.NoError(t, err, "Failed to get applications for deletion")
	assert.NotEmpty(t, applications, "Expected applications to exist for deletion")

	// Delete an application
	err = testUtils.ApplicationRepo.Delete(applications[0].ID)
	require.NoError(t, err, "Failed to delete application")

	// Verify deletion
	_, err = testUtils.ApplicationRepo.GetByID(applications[0].ID, &params.Populate)
	assert.Error(t, err, "Expected error when getting deleted application")
}
