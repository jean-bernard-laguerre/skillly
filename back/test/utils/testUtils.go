package testUtils

import (
	"net/http"
	"net/http/httptest"

	"github.com/golang-jwt/jwt/v5"

	"github.com/gin-gonic/gin"

	"net/url"
	chatConf "skillly/chat/config"
	"skillly/chat/handlers/message"
	"skillly/chat/handlers/room"
	"skillly/pkg/config"
	"skillly/pkg/handlers/application"
	authDto "skillly/pkg/handlers/auth/dto"
	candidate "skillly/pkg/handlers/candidateProfile"
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/company"
	companyDto "skillly/pkg/handlers/company/dto"
	"skillly/pkg/handlers/jobPost"
	"skillly/pkg/handlers/match"
	recruiter "skillly/pkg/handlers/recruiterProfile"
	"skillly/pkg/handlers/skill"
	"skillly/pkg/handlers/user"
	"skillly/pkg/models"
)

// App repositories
var UserRepo user.UserRepository
var CandidateRepo candidate.CandidateRepository
var RecruiterRepo recruiter.RecruiterRepository
var ApplicationRepo application.ApplicationRepository
var CompanyRepo company.CompanyRepository
var JobPostRepo jobPost.JobPostRepository
var MatchRepo match.MatchRepository
var SkillRepo skill.SkillRepository
var CertifRepo certification.CertificationRepository

// Chat repositories
var MessageRepo message.MessageRepository
var RoomRepo room.RoomRepository

func InitTestRepositories() {
	UserRepo = user.NewUserRepository(config.DB)
	CandidateRepo = candidate.NewCandidateRepository(config.DB)
	RecruiterRepo = recruiter.NewRecruiterRepository(config.DB)
	ApplicationRepo = application.NewApplicationRepository(config.DB)
	CompanyRepo = company.NewCompanyRepository(config.DB)
	JobPostRepo = jobPost.NewJobPostRepository(config.DB)
	MatchRepo = match.NewMatchRepository(config.DB)
	SkillRepo = skill.NewSkillRepository(config.DB)
	CertifRepo = certification.NewCertificationRepository(config.DB)

	MessageRepo = message.NewMessageRepository(chatConf.DBMongo)
	RoomRepo = room.NewRoomRepository(chatConf.DBMongo)
}

func CreateTestContext() *gin.Context {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Set the request method and URL
	c.Request = &http.Request{
		Method: "GET",
		URL:    &url.URL{Path: "/test"},
	}

	return c
}

var TestRecruiter = authDto.RecruterRegisterDTO{
	FirstName: "Test",
	LastName:  "Recruiter",
	Email:     "TestRecruiter@test.com",
	Password:  "password123",
	Title:     "Test Title",
	NewCompany: &companyDto.CreateCompanyDTO{
		CompanyName: "Test Company",
		SIRET:       "12345678901234",
		Description: "Test Company Description",
		Industry:    "Test Industry",
		WebSite:     "https://testcompany.com",
		Location:    "Test Location",
		Logo:        "https://testcompany.com/logo.png",
		Size:        "50-100",
	},
}

var TestCandidate = authDto.CandidateRegisterDTO{
	FirstName:        "Test",
	LastName:         "Candidate",
	Email:            "TestCandidate@test.com",
	Password:         "password123",
	Bio:              "Test Bio",
	ExperienceYear:   5,
	PreferedContract: models.CDIContract,
	PreferedJob:      "Software Engineer",
	Location:         "Test Location",
	Availability:     "Full-time",

	Certifications: []uint{1, 2},
	Skills:         []uint{1, 2},
}

var TestLogin = authDto.LoginDto{
	Email:    "TestCandidate@test.com",
	Password: "password123",
}

var CandidateToken = jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	"email":     TestCandidate.Email,
	"role":      models.RoleCandidate,
	"id":        1,
	"firstName": TestCandidate.FirstName,
	"lastName":  TestCandidate.LastName,
	/* "exp":         "24h", */
	"candidateID": 1,
})

var RecruiterToken = jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	"email":     TestRecruiter.Email,
	"role":      models.RoleRecruiter,
	"id":        1,
	"firstName": TestRecruiter.FirstName,
	"lastName":  TestRecruiter.LastName,
	/* "exp":         "24h", */
	"recruiterID": 1,
	"companyID":   1,
	"authRole":    models.RecruiterRole,
})
