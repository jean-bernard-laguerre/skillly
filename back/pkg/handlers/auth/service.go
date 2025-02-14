package auth

import (
	"skillly/pkg/handlers/user"
	userDto "skillly/pkg/handlers/user/dto"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	newUser := userDto.CreateUserDTO{}
	err := c.BindJSON(&newUser)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Hash the password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	newUser.Password = string(hashPassword)

	// Create the user
	userModel := user.User{}
	_, err = userModel.Create(newUser)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User created"})
}

func Login(c *gin.Context) {
	// TODO
}
