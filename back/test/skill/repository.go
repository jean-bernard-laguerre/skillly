package skill_test

import (
	"skillly/pkg/config"
	skillDto "skillly/pkg/handlers/skill/dto"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func CreateSkill(t *testing.T) {
	// Create a new skill
	newSkill := skillDto.CreateSkillDTO{
		Name:     "Go Programming",
		Category: "Programming Languages",
	}

	skill, err := testUtils.SkillRepo.CreateSKill(newSkill, config.DB)
	require.NoError(t, err, "Failed to create skill")

	assert.NotNil(t, skill, "Expected skill to be created")
	assert.Equal(t, newSkill.Name, skill.Name, "Expected skill name to match")
	assert.Equal(t, newSkill.Category, skill.Category, "Expected skill category to match")
}

func GetSkillById(t *testing.T) {
	context := testUtils.CreateTestContext()

	params := utils.GetUrlParams(context)
	skill, err := testUtils.SkillRepo.GetByID(uint(1), &params.Populate)

	require.NoError(t, err, "Failed to get skill by ID")
	assert.Equal(t, uint(1), skill.ID, "Expected skill ID to match")
}

func UpdateSkill(t *testing.T) {
	// Create a new skill to update
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	update, err := testUtils.SkillRepo.GetByID(uint(1), &params.Populate)
	require.NoError(t, err, "Failed to get skill for update")

	update.Name = "Updated Go Programming"
	err = testUtils.SkillRepo.Update(&update)
	require.NoError(t, err, "Failed to update skill")

	// Fetch the updated skill
	updatedSkill, err := testUtils.SkillRepo.GetByID(update.ID, &params.Populate)
	require.NoError(t, err, "Failed to get updated skill")
	assert.Equal(t, "Updated Go Programming", updatedSkill.Name, "Expected updated skill name to match")
}

func DeleteSkill(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	// Get skills for deletion
	skills, err := testUtils.SkillRepo.GetAll(params)
	require.NoError(t, err, "Failed to get skill for deletion")
	assert.NotEmpty(t, skills, "Expected skills to exist for deletion")

	err = testUtils.SkillRepo.Delete(skills[0].ID)
	require.NoError(t, err, "Failed to delete skill")

	// Verify that the skill is deleted
	_, err = testUtils.SkillRepo.GetByID(skills[0].ID, &params.Populate)
	require.Error(t, err, "Expected error when getting deleted skill")
}
