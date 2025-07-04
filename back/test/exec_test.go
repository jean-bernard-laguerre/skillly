package test

import (
	"testing"

	db_test "skillly/test/db"
	user_test "skillly/test/user"
)

func TestDB(t *testing.T) {
	t.Run("PostgresDatabaseConnection", db_test.PostgresDatabaseConnection)
	t.Run("MongoDatabaseConnection", db_test.MongoDatabaseConnection)
	t.Run("PostgresTableCheck", db_test.PostgresTableCheck)
	/* t.Run("MongoCollectionCheck", db_test.MongoCollectionCheck) */

}

func TestUser(t *testing.T) {
	t.Run("CreateUser", user_test.CreateUser)
	t.Run("GetUserById", user_test.GetUserById)
	t.Run("GetUserByEmail", user_test.GetUserByEmail)
	t.Run("GetAllUsers", user_test.GetAllUsers)
}
