package test

import (
	"log"
	"testing"

	db_test "skillly/test/db"
)

func TestDB(t *testing.T) {
	t.Run("PostgresDatabaseConnection", db_test.PostgresDatabaseConnection)
	t.Run("MongoDatabaseConnection", db_test.MongoDatabaseConnection)
	t.Run("PostgresTableCheck", db_test.PostgresTableCheck)
	t.Run("MongoCollectionCheck", db_test.MongoCollectionCheck)

}

func TestUser(t *testing.T) {
	log.Println("TestUser")
}
