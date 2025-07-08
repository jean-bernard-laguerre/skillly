package jobPost_test

import (
	"skillly/pkg/config"
	"skillly/pkg/models"
	"testing"
	"time"

	jobPostDto "skillly/pkg/handlers/jobPost/dto"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func CreateJobPost(t *testing.T) {
	// Create a new job post
	newJobPost := jobPostDto.CreateJobPostDTO{
		Title:           "Software Engineer",
		Description:     "Develop and maintain software applications.",
		Location:        "Paris, France",
		Contract_type:   models.CDIContract,
		Salary_range:    "50,000 - 70,000 EUR",
		Expiration_Date: time.Date(2024, 12, 31, 0, 0, 0, 0, time.UTC),
		CompanyID:       1, // Assuming company with ID 1 exists
	}

	jobPost, err := testUtils.JobPostRepo.CreateJobPost(newJobPost, config.DB)
	require.NoError(t, err, "Failed to create job post")

	assert.NotNil(t, jobPost, "Expected job post to be created")
	assert.Equal(t, newJobPost.Title, jobPost.Title, "Expected job post title to match")
	assert.Equal(t, newJobPost.Description, jobPost.Description, "Expected job post description to match")
}

func GetJobPostById(t *testing.T) {
	context := testUtils.CreateTestContext()

	params := utils.GetUrlParams(context)
	jobPost, err := testUtils.JobPostRepo.GetByID(uint(1), &params.Populate)

	require.NoError(t, err, "Failed to get job post by ID")
	assert.Equal(t, uint(1), jobPost.ID, "Expected job post ID to match")
}

func UpdateJobPost(t *testing.T) {
	// Create a new job post to update
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	update, err := testUtils.JobPostRepo.GetByID(uint(1), &params.Populate)
	require.NoError(t, err, "Failed to get job post for update")

	update.Title = "Updated Software Engineer"
	err = testUtils.JobPostRepo.Update(&update)
	require.NoError(t, err, "Failed to update job post")

	// Fetch the updated job post
	updatedJobPost, err := testUtils.JobPostRepo.GetByID(update.ID, &params.Populate)
	require.NoError(t, err, "Failed to get updated job post")

	assert.Equal(t, update.Title, updatedJobPost.Title, "Expected updated job post title to match")
}

func DeleteJobPost(t *testing.T) {
	// Create a new job post to delete
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	jobPost, err := testUtils.JobPostRepo.GetByID(uint(1), &params.Populate)
	require.NoError(t, err, "Failed to get job post for deletion")

	err = testUtils.JobPostRepo.Delete(jobPost.ID)
	require.NoError(t, err, "Failed to delete job post")

	// Try to fetch the deleted job post
	_, err = testUtils.JobPostRepo.GetByID(jobPost.ID, &params.Populate)
	assert.Error(t, err, "Expected error when fetching deleted job post")
}
