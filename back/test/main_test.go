package test

import (
	"os"
	"testing"

	"skillly/pkg/db"
)

func TestMain(m *testing.M) {

	// Setup the test database
	dbUser := os.Getenv("TEST_DB_USER")
	dbPassword := os.Getenv("TEST_DB_PASSWORD")
	dbName := os.Getenv("TEST_DB_NAME")
	host := os.Getenv("TEST_DB_HOST")
	port := os.Getenv("TEST_DB_PORT")

	db.Init(
		dbUser, dbPassword, dbName, host, port,
	)
	// Run the tests
	code := m.Run()

	// Clean up

	// Exit with the test code
	os.Exit(code)
}
