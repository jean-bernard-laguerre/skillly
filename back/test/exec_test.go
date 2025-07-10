package test

import (
	"testing"

	application_test "skillly/test/application"
	auth_test "skillly/test/auth"
	certification_test "skillly/test/certification"
	db_test "skillly/test/db"
	jobpost_test "skillly/test/jobPost"
	match_test "skillly/test/match"
	middleware_test "skillly/test/middleware"
	skill_test "skillly/test/skill"
	user_test "skillly/test/user"
)

func TestDB(t *testing.T) {
	t.Run("PostgresDatabaseConnection", db_test.PostgresDatabaseConnection)
	t.Run("MongoDatabaseConnection", db_test.MongoDatabaseConnection)
	t.Run("PostgresTableCheck", db_test.PostgresTableCheck)
	t.Run("MongoCollectionCheck", db_test.MongoCollectionCheck)

}

func TestAuth(t *testing.T) {
	t.Run("RegisterCandidate", auth_test.RegisterCandidate)
	t.Run("RegisterRecruiter", auth_test.RegisterRecruiter)
	t.Run("Login", auth_test.Login)
}

func TestUser(t *testing.T) {
	t.Run("CreateUser", user_test.CreateUser)
	t.Run("GetUserByEmail", user_test.GetUserByEmail)
	t.Run("UpdateUser", user_test.UpdateUser)
	t.Run("GetAllUsers", user_test.GetAllUsers)
	t.Run("GetUserById", user_test.GetUserById)
}

func TestJobPost(t *testing.T) {
	t.Run("CreateJobPost", jobpost_test.CreateJobPost)
	t.Run("GetJobPostById", jobpost_test.GetJobPostById)
	t.Run("UpdateJobPost", jobpost_test.UpdateJobPost)
}

func TestApplication(t *testing.T) {
	t.Run("CreateApplication", application_test.CreateApplication)
	t.Run("GetApplicationById", application_test.GetApplicationById)
	t.Run("UpdateApplication", application_test.UpdateApplication)
}

func TestMatch(t *testing.T) {
	t.Run("CreateMatch", match_test.CreateMatch)
	t.Run("GetMatchById", match_test.GetMatchById)
}

func TestSkill(t *testing.T) {
	t.Run("CreateSkill", skill_test.CreateSkill)
	t.Run("GetSkillById", skill_test.GetSkillById)
	t.Run("UpdateSkill", skill_test.UpdateSkill)
}

func TestCertification(t *testing.T) {
	t.Run("CreateCertification", certification_test.CreateCertification)
	t.Run("GetCertificationById", certification_test.GetCertificationById)
	t.Run("UpdateCertification", certification_test.UpdateCertification)
}

func TestMiddlewares(t *testing.T) {
	t.Run("AuthMiddleware", middleware_test.TestAuthMiddleware)
	t.Run("AuthMiddlewareUnauthaurized", middleware_test.TestAuthMiddlewareUnauthorized)
	t.Run("RoleMiddleware", middleware_test.TestRoleMiddleware)
	t.Run("RoleMiddlewareForbidden", middleware_test.TestRoleMiddlewareForbidden)
}

func TestDelete(t *testing.T) {
	t.Run("DeleteMatch", match_test.DeleteMatch)
	t.Run("DeleteApplication", application_test.DeleteApplication)
	t.Run("DeleteJobPost", jobpost_test.DeleteJobPost)
	t.Run("DeleteUser", user_test.DeleteUser)
	t.Run("DeleteSkill", skill_test.DeleteSkill)
	t.Run("DeleteCertification", certification_test.DeleteCertification)
}
