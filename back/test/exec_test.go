package test

import (
	"testing"

	auth_test "skillly/test/auth"
	db_test "skillly/test/db"
	user_test "skillly/test/user"
)

func TestDB(t *testing.T) {
	t.Run("PostgresDatabaseConnection", db_test.PostgresDatabaseConnection)
	t.Run("MongoDatabaseConnection", db_test.MongoDatabaseConnection)
	t.Run("PostgresTableCheck", db_test.PostgresTableCheck)
	/* t.Run("MongoCollectionCheck", db_test.MongoCollectionCheck) */

}

func TestAuth(t *testing.T) {
	t.Run("RegisterCandidate", auth_test.RegisterCandidate)
	t.Run("RegisterRecruiter", auth_test.RegisterRecruiter)
}

func TestUser(t *testing.T) {
	t.Run("CreateUser", user_test.CreateUser)
	t.Run("GetUserByEmail", user_test.GetUserByEmail)
	t.Run("UpdateUser", user_test.UpdateUser)
	t.Run("GetAllUsers", user_test.GetAllUsers)
	t.Run("GetUserById", user_test.GetUserById)
}

func DeleteEverything(t *testing.T) {
	t.Run("DeleteUser", user_test.DeleteUser)
}
