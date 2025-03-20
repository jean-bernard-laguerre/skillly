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

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"skillly/pkg/config"

	"golang.org/x/crypto/bcrypt"
)

// RegisterCandidate is a handler that creates a new candidate and user
func RegisterCandidate(c *gin.Context) {
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
			Role:      user.RoleCandidate,
		}

		// Create the user
		userModel := user.User{}
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
		candidateModel := candidate.ProfileCandidate{}
		_, err = candidateModel.Create(newCandidate, tx)

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
func RegisterRecruiter(c *gin.Context) {
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
			Role:      user.RoleRecruiter,
		}

		// Create the user
		userModel := user.User{}
		savedUser, err := userModel.Create(newUser, tx)

		if err != nil {
			return err
		}

		newRecruiter := recruiterDto.CreateRecruiterDTO{
			Title:     recruiterRegister.Title,
			CompanyID: recruiterRegister.Company,
			User:      savedUser,
		}

		// if the recruiter is creating a new company create it
		if recruiterRegister.NewCompany != nil {
			companyModel := company.Company{}
			savedCompany, err := companyModel.Create(*recruiterRegister.NewCompany, tx)

			if err != nil {
				return err
			}

			newRecruiter.CompanyID = savedCompany.ID
			newRecruiter.Role = recruiter.AdminRole
		}

		// Create the recruiter
		recruiterModel := recruiter.ProfileRecruiter{}
		_, err = recruiterModel.Create(newRecruiter, tx)

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

func Login(c *gin.Context) {
	// TODO

	userLogin := authDto.LoginDto{}
	err := c.BindJSON(&userLogin)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	userModel := user.User{}
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
		"exp":       15000,
	})

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
