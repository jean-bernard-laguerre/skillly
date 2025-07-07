package testUtils

import (
	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"

	"net/url"
	"skillly/pkg/config"
	authDto "skillly/pkg/handlers/auth/dto"
	candidate "skillly/pkg/handlers/candidateProfile"
	companyDto "skillly/pkg/handlers/company/dto"
	recruiter "skillly/pkg/handlers/recruiterProfile"
	"skillly/pkg/handlers/user"
	"skillly/pkg/models"
)

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

var UserRepo user.UserRepository
var CandidateRepo candidate.CandidateRepository
var RecruiterRepo recruiter.RecruiterRepository

func InitTestRepositories() {
	UserRepo = user.NewUserRepository(config.DB)
	CandidateRepo = candidate.NewCandidateRepository(config.DB)
	RecruiterRepo = recruiter.NewRecruiterRepository(config.DB)
}
