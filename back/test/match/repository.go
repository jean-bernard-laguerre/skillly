package match_test

import (
	"skillly/pkg/config"
	matchDto "skillly/pkg/handlers/match/dto"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func CreateMatch(t *testing.T) {

	// Create a new match
	newMatch := matchDto.CreateMatchDTO{
		CandidateID:   1, // Assuming candidate with ID 1 exists
		JobPostID:     1, // Assuming job post with ID 1 exists
		ApplicationID: 1, // Assuming application with ID 1 exists
	}

	match, err := testUtils.MatchRepo.CreateMatch(newMatch, config.DB)
	require.NoError(t, err, "Failed to create match")

	assert.NotNil(t, match, "Expected match to be created")
	assert.Equal(t, newMatch.CandidateID, match.CandidateID, "Expected candidate ID to match")
	assert.Equal(t, newMatch.JobPostID, match.JobPostID, "Expected job post ID to match")
}

func GetMatchById(t *testing.T) {
	context := testUtils.CreateTestContext()

	params := utils.GetUrlParams(context)
	match, err := testUtils.MatchRepo.GetByID(uint(1), &params.Populate)

	require.NoError(t, err, "Failed to get match by ID")
	assert.Equal(t, uint(1), match.ID, "Expected match ID to match")
}

func DeleteMatch(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	// Get matches for deletion
	match, err := testUtils.MatchRepo.GetAll(params)
	require.NoError(t, err, "Failed to get match for deletion")
	assert.NotEmpty(t, match, "Expected match to exist for deletion")

	err = testUtils.MatchRepo.Delete(match[0].ID)
	require.NoError(t, err, "Failed to delete match")

	// Verify that the match is deleted
	_, err = testUtils.MatchRepo.GetByID(match[0].ID, &params.Populate)
	require.Error(t, err, "Expected error when getting deleted match")

}
