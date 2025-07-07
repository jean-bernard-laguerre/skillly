package test

import (
	"testing"

	"skillly/test/auth_test"
	"skillly/test/db_test"
	"skillly/test/user_test"
	testUtils "skillly/test/utils"
)

func TestDB(t *testing.T) {
	t.Run("PostgresDatabaseConnection", db_test.PostgresDatabaseConnection)
	t.Run("MongoDatabaseConnection", db_test.MongoDatabaseConnection)
	t.Run("PostgresTableCheck", db_test.PostgresTableCheck)
	/* t.Run("MongoCollectionCheck", db_test.MongoCollectionCheck) */

}

func TestAuth(t *testing.T) {
	t.Run("RegisterCandidate", auth_test.RegisterCandidate())
	t.Run("RegisterRecruiter", auth_test.RegisterRecruiter())
}

func TestUser(t *testing.T) {

	ctx := testUtils.CreateTestContext()

	t.Run("CreateUser", user_test.CreateUser)
	t.Run("GetUserById", user_test.GetUserById(ctx))
	t.Run("GetUserByEmail", user_test.GetUserByEmail)
	t.Run("UpdateUser", user_test.UpdateUser(ctx))
	t.Run("GetAllUsers", user_test.GetAllUsers(ctx))
	t.Run("DeleteUser", user_test.DeleteUser(ctx))
}

func DeleteEverything(t *testing.T) {

}
