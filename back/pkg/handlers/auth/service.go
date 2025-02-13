package auth

import (
	"skillly/pkg/handlers/user"
	"skillly/pkg/handlers/user/dto"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	err := c.BindJSON(&dto.CreateUserDTO{})

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Create the user
	register := user.UserModel{}

	_, err = register.Create(dto.CreateUserDTO{})

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User created"})
}

func Login(c *gin.Context) {

}
