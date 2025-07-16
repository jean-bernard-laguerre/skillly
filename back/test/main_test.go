package test

import (
	"os"
	"testing"

	"skillly/test/setup"
	testUtils "skillly/test/utils"
)

func TestMain(m *testing.M) {

	// Setup the tests databases
	setup.SetupTestPostgres()
	setup.SetupTestMongo()

	testUtils.InitTestRepositories()

	// Run the tests
	code := m.Run()

	// Clean up
	setup.CleanupTestPostgres()
	setup.CleanupTestMongo()

	// Exit with the test code
	os.Exit(code)
}
