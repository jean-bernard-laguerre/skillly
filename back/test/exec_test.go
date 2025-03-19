package test

import (
	"log"
	"testing"

	db_test "skillly/test/db"
)

func TestDB(t *testing.T) {
	t.Run("DatabaseConnection", db_test.DatabaseConnection)
}

func TestUser(t *testing.T) {
	log.Println("TestUser")
}
