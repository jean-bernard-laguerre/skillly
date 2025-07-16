package setup

import (
	"os"
	"skillly/pkg/config"
	"skillly/pkg/db"

	"github.com/joho/godotenv"
)

func SetupTestPostgres() {

	_ = godotenv.Load()

	dbUser := os.Getenv("TEST_DB_USER")
	dbPassword := os.Getenv("TEST_DB_PASSWORD")
	dbName := os.Getenv("TEST_DB_NAME")
	host := os.Getenv("TEST_DB_HOST")
	port := os.Getenv("TEST_DB_PORT")

	db.Init(
		dbUser, dbPassword, dbName, host, port,
	)
}

func CleanupTestPostgres() {
	if config.DB != nil {
		// Drop all test tables or drop the entire test database
		config.DB.Exec("DROP SCHEMA IF EXISTS test CASCADE")

		// Close the connection
		sqlDB, err := config.DB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}
