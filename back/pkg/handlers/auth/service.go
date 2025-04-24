package auth

import (
	authDto "skillly/pkg/handlers/auth/dto"
	candidate "skillly/pkg/handlers/candidateProfile"
	candidateDto "skillly/pkg/handlers/candidateProfile/dto"
	"skillly/pkg/handlers/company"
	recruiter "skillly/pkg/handlers/recruiterProfile"
	recruiterDto "skillly/pkg/handlers/recruiterProfile/dto"
	"skillly/pkg/handlers/user"
	userDto "skillly/pkg/handlers/user/dto"

	"skillly/pkg/models"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"skillly/pkg/config"

	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	RegisterCandidate(c *gin.Context)
	RegisterRecruiter(c *gin.Context)
	Login(c *gin.Context)
}

type authService struct {
	companyRepository   company.CompanyRepository
	recruiterRepository recruiter.RecruiterRepository
	candidateRepository candidate.CandidateRepository
}

func NewAuthService() AuthService {
	return &authService{
		companyRepository:   company.NewCompanyRepository(config.DB),
		recruiterRepository: recruiter.NewRecruiterRepository(config.DB),
		candidateRepository: candidate.NewCandidateRepository(config.DB),
	}
}

// RegisterCandidate is a handler that creates a new candidate and user
func (s *authService) RegisterCandidate(c *gin.Context) {
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		candidateRegister := authDto.CandidateRegisterDTO{}
		err := c.BindJSON(&candidateRegister)

		if err != nil {
			return err
		}

		newUser := userDto.CreateUserDTO{
			FirstName: candidateRegister.FirstName,
			LastName:  candidateRegister.LastName,
			Email:     candidateRegister.Email,
			Password:  candidateRegister.Password,
			Role:      models.RoleCandidate,
		}

		// Create the user
		userModel := user.UserRepository{}
		savedUser, err := userModel.Create(newUser, tx)

		if err != nil {
			return err
		}

		newCandidate := candidateDto.CreateCandidateDTO{
			Bio:              candidateRegister.Bio,
			Location:         candidateRegister.Location,
			ExperienceYear:   candidateRegister.ExperienceYear,
			PreferedContract: candidateRegister.PreferedContract,
			PreferedJob:      candidateRegister.PreferedJob,
			Availability:     candidateRegister.Availability,
			ResumeID:         candidateRegister.ResumeID,
			Certifications:   candidateRegister.Certifications,
			Skills:           candidateRegister.Skills,
			User:             savedUser,
		}

		// Create the candidate
		_, err = s.candidateRepository.CreateCandidate(newCandidate, tx)

		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Candidate created successfully"})
}

// RegisterRecruiter is a handler that creates a new recruiter and user
func (s *authService) RegisterRecruiter(c *gin.Context) {
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		recruiterRegister := authDto.RecruterRegisterDTO{}
		err := c.BindJSON(&recruiterRegister)

		if err != nil {
			return err
		}

		newUser := userDto.CreateUserDTO{
			FirstName: recruiterRegister.FirstName,
			LastName:  recruiterRegister.LastName,
			Email:     recruiterRegister.Email,
			Password:  recruiterRegister.Password,
			Role:      models.RoleRecruiter,
		}

		// Create the user
		userModel := user.UserRepository{}
		savedUser, err := userModel.Create(newUser, tx)

		if err != nil {
			return err
		}

		newRecruiter := recruiterDto.CreateRecruiterDTO{
			Title:     recruiterRegister.Title,
			CompanyID: recruiterRegister.Company,
			User:      savedUser,
		}

		// if the recruiter is creating a new auth create it
		if recruiterRegister.NewCompany != nil {
			savedCompany, err := s.companyRepository.CreateCompany(*recruiterRegister.NewCompany, tx)

			if err != nil {
				return err
			}

			newRecruiter.CompanyID = savedCompany.ID
			newRecruiter.Role = models.AdminRole
		}

		// Create the recruiter
		_, err = s.recruiterRepository.CreateRecruiter(newRecruiter, tx)

		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Recruiter created successfully"})
}

func (s *authService) Login(c *gin.Context) {
	// TODO

	userLogin := authDto.LoginDto{}
	err := c.BindJSON(&userLogin)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	userModel := user.UserRepository{}
	user, err := userModel.GetByEmail(userLogin.Email)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	if user.ID == 0 {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	// Check the password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userLogin.Password))
	if err != nil {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":     user.Email,
		"role":      user.Role,
		"id":        user.ID,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		/* "exp":       "24h", */
	})

	if user.Role == models.RoleRecruiter {
		token.Claims.(jwt.MapClaims)["companyID"] = user.ProfileRecruiter.CompanyID
		token.Claims.(jwt.MapClaims)["authRole"] = user.ProfileRecruiter.Role
		token.Claims.(jwt.MapClaims)["recruiterID"] = user.ProfileRecruiter.ID
	} else {
		token.Claims.(jwt.MapClaims)["candidateID"] = user.ProfileCandidate.ID
	}

	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"user":  user,
		"token": tokenString,
	})
}
