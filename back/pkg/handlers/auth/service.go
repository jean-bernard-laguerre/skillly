package auth

import (
	authDto "skillly/pkg/handlers/auth/dto"
	candidate "skillly/pkg/handlers/candidateProfile"
	candidateDto "skillly/pkg/handlers/candidateProfile/dto"
	recruiter "skillly/pkg/handlers/recruiterProfile"
	recruiterDto "skillly/pkg/handlers/recruiterProfile/dto"
	"skillly/pkg/handlers/user"
	userDto "skillly/pkg/handlers/user/dto"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"

	"skillly/pkg/config"
)

// RegisterCandidate is a handler that creates a new candidate and user
func RegisterCandidate(c *gin.Context) {
	config.DB.Transaction(func(tx *gorm.DB) error {
		candidateRegister := authDto.CandidateRegisterDTO{}
		err := c.BindJSON(&candidateRegister)

		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
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
			c.JSON(500, gin.H{"error": err.Error()})
			return err
		}

		newCandidate := candidateDto.CreateCandidateDTO{
			Bio:             candidateRegister.Bio,
			Location:        candidateRegister.Location,
			ExperienceYear:  candidateRegister.ExperienceYear,
			PreferedJobType: candidateRegister.PreferedJobType,
			Availability:    candidateRegister.Availability,
			ResumeID:        candidateRegister.ResumeID,
			Certifications:  candidateRegister.Certifications,
			Skills:          candidateRegister.Skills,
			User:            savedUser,
		}

		// Create the candidate
		candidateModel := candidate.ProfileCandidate{}
		_, err = candidateModel.Create(newCandidate, tx)

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return err
		}

		return nil
	})
}

// RegisterRecruiter is a handler that creates a new recruiter and user
func RegisterRecruiter(c *gin.Context) {
	config.DB.Transaction(func(tx *gorm.DB) error {
		recruiterRegister := authDto.RecruterRegisterDTO{}
		err := c.BindJSON(&recruiterRegister)

		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
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
			c.JSON(500, gin.H{"error": err.Error()})
			return err
		}

		newRecruiter := recruiterDto.CreateRecruiterDTO{
			Title:   recruiterRegister.Title,
			Company: recruiterRegister.Company,
			User:    savedUser,
		}

		// Create the recruiter
		recruiterModel := recruiter.ProfileRecruiter{}
		_, err = recruiterModel.Create(newRecruiter)

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return err
		}

		return nil
	})
}

func Login(c *gin.Context) {
	// TODO
}
