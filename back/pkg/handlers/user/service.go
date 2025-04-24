package user

import (
	"errors"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"skillly/pkg/config"
	userDto "skillly/pkg/handlers/user/dto"
)

func CreateUser(c *gin.Context) {
	dto := userDto.CreateUserDTO{}
	err := c.BindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	userRepository := UserRepository{}
	user, err := userRepository.Create(dto, config.DB)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, user)
}

func GetAll(c *gin.Context) {
	userRepository := UserRepository{}
	users, err := userRepository.GetAll()
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, users)
}

func GetById(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	userRepository := UserRepository{}
	user, err := userRepository.GetByID(uint(id))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, user)
}

func UpdateUser(c *gin.Context) {
	userRepository := UserRepository{}
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	user, err := userRepository.Update(uint(id), c.PostForm("name"), c.PostForm("email"), config.DB)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, user)
}

func DeleteUser(c *gin.Context) {
	userRepository := UserRepository{}
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	err = userRepository.Delete(uint(id))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User deleted successfully"})
}

// AddUserSkills ajoute des compétences et certifications à un utilisateur
func AddUserSkills(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		fmt.Println("userID", userID)
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	requestedID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	if uint(requestedID) != userID.(uint) {
		c.JSON(403, gin.H{"error": "Forbidden: You can only update your own profile"})
		return
	}

	var dto userDto.UpdateUserSkillsDTO
	if err := c.BindJSON(&dto); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	// On ne log plus le DTO entier ici pour éviter trop de bruit
	fmt.Printf("Adding skills/certs for User ID: %d\n", userID.(uint))

	userRepository := UserRepository{}
	// Appel de la nouvelle fonction AddUserSkills
	if err := userRepository.AddUserSkills(uint(requestedID), dto); err != nil {
		fmt.Printf("Error adding skills/certs: %v\n", err)
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Skills and/or certifications added successfully"})
}

// DeleteUserSkill supprime une compétence spécifique pour un utilisateur
func DeleteUserSkill(c *gin.Context) {
	// Récupérer et valider l'ID utilisateur depuis le contexte
	userIDCtx, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDCtx.(uint)

	// Récupérer et valider l'ID utilisateur depuis l'URL
	requestedID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid User ID"})
		return
	}

	// Vérifier l'autorisation
	if uint(requestedID) != userID {
		c.JSON(403, gin.H{"error": "Forbidden: You can only delete skills from your own profile"})
		return
	}

	// Récupérer et valider l'ID de la compétence depuis l'URL
	skillID, err := strconv.ParseUint(c.Param("skillId"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid Skill ID"})
		return
	}

	// Appeler le repository
	userRepository := UserRepository{}
	if err := userRepository.DeleteUserSkill(userID, uint(skillID)); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "Skill association not found"})
		} else {
			fmt.Printf("Error deleting skill association: %v\n", err)
			c.JSON(500, gin.H{"error": "Failed to delete skill association"})
		}
		return
	}

	c.JSON(200, gin.H{"message": "Skill association deleted successfully"})
}

// DeleteUserCertification supprime une certification spécifique pour un utilisateur
func DeleteUserCertification(c *gin.Context) {
	// Récupérer et valider l'ID utilisateur depuis le contexte
	userIDCtx, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDCtx.(uint)

	// Récupérer et valider l'ID utilisateur depuis l'URL
	requestedID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid User ID"})
		return
	}

	// Vérifier l'autorisation
	if uint(requestedID) != userID {
		c.JSON(403, gin.H{"error": "Forbidden: You can only delete certifications from your own profile"})
		return
	}

	// Récupérer et valider l'ID de la certification depuis l'URL
	certificationID, err := strconv.ParseUint(c.Param("certificationId"), 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid Certification ID"})
		return
	}

	// Appeler le repository
	userRepository := UserRepository{}
	if err := userRepository.DeleteUserCertification(userID, uint(certificationID)); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "Certification association not found"})
		} else {
			fmt.Printf("Error deleting certification association: %v\n", err)
			c.JSON(500, gin.H{"error": "Failed to delete certification association"})
		}
		return
	}

	c.JSON(200, gin.H{"message": "Certification association deleted successfully"})
}
