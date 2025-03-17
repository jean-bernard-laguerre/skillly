package test

import (
	"os"
	"testing"
)

func TestMain(m *testing.M) {

	// Setup the test database

	// Run the tests
	code := m.Run()

	// Clean up

	// Exit with the test code
	os.Exit(code)
}
