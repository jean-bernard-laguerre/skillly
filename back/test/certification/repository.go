package certification_test

import (
	"skillly/pkg/config"
	certificationDto "skillly/pkg/handlers/certification/dto"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func CreateCertification(t *testing.T) {
	// Create a new certification
	newCertification := certificationDto.CreateCertificationDTO{
		Name:     "AWS Certified Solutions Architect",
		Category: "Cloud Computing",
	}

	certification, err := testUtils.CertifRepo.CreateCertification(newCertification, config.DB)
	require.NoError(t, err, "Failed to create certification")

	assert.NotNil(t, certification, "Expected certification to be created")
	assert.Equal(t, newCertification.Name, certification.Name, "Expected certification name to match")
	assert.Equal(t, newCertification.Category, certification.Category, "Expected certification category to match")
}

func GetCertificationById(t *testing.T) {
	context := testUtils.CreateTestContext()

	params := utils.GetUrlParams(context)
	certification, err := testUtils.CertifRepo.GetByID(uint(1), &params.Populate)

	require.NoError(t, err, "Failed to get certification by ID")
	assert.Equal(t, uint(1), certification.ID, "Expected certification ID to match")
}

func UpdateCertification(t *testing.T) {
	// Create a new certification to update
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	update, err := testUtils.CertifRepo.GetByID(uint(1), &params.Populate)
	require.NoError(t, err, "Failed to get certification for update")

	update.Name = "Updated AWS Certified Solutions Architect"
	err = testUtils.CertifRepo.Update(&update)
	require.NoError(t, err, "Failed to update certification")

	// Fetch the updated certification
	updatedCertification, err := testUtils.CertifRepo.GetByID(update.ID, &params.Populate)
	require.NoError(t, err, "Failed to get updated certification")
	assert.Equal(t, "Updated AWS Certified Solutions Architect", updatedCertification.Name, "Expected updated certification name to match")
}

func DeleteCertification(t *testing.T) {
	// Create a new certification to delete
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	certifications, err := testUtils.CertifRepo.GetAll(params)
	require.NoError(t, err, "Failed to get certification for deletion")
	assert.NotEmpty(t, certifications, "Expected certifications to exist for deletion")

	err = testUtils.CertifRepo.Delete(certifications[0].ID)
	require.NoError(t, err, "Failed to delete certification")

	// Verify that the certification is deleted
	deletedCertification, err := testUtils.CertifRepo.GetByID(certifications[0].ID, &params.Populate)
	require.Error(t, err, "Expected error when getting deleted certification")
	assert.Nil(t, deletedCertification, "Expected certification to be nil after deletion")
}
