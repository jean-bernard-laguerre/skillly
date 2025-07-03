package test

import (
	"os"
	"testing"

	"skillly/test/setup"
)

func TestMain(m *testing.M) {

	// Setup the tests databases
	setup.SetupTestPostgres()
	setup.SetupTestMongo()

	// Run the tests
	code := m.Run()

	// Clean up
	setup.CleanupTestPostgres()
	setup.CleanupTestMongo()

	// Exit with the test code
	os.Exit(code)
}
