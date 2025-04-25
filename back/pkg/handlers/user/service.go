package user

import (
	"errors"
	"fmt"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"skillly/pkg/config"
	candidate "skillly/pkg/handlers/candidateProfile"
	candidateDto "skillly/pkg/handlers/candidateProfile/dto"
	userDto "skillly/pkg/handlers/user/dto"
	"skillly/pkg/models"
	"skillly/pkg/utils"
)

type UserService interface {
	CreateUser(c *gin.Context)
	GetAll(c *gin.Context)
	GetById(c *gin.Context)
	UpdateUser(c *gin.Context)
	DeleteUser(c *gin.Context)
	AddUserSkills(c *gin.Context)
	DeleteUserSkill(c *gin.Context)
}

type userService struct {
	userRepository      UserRepository
	candidateRepository candidate.CandidateRepository
}

func NewUserService() UserService {
	return &userService{
		userRepository:      NewUserRepository(config.DB),
		candidateRepository: candidate.NewCandidateRepository(config.DB),
	}
}

func (s *userService) CreateUser(c *gin.Context) {
	dto := userDto.CreateUserDTO{}
	err := c.BindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	user, err := s.userRepository.CreateUser(dto, config.DB)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, user)
}

func (s *userService) GetAll(c *gin.Context) {
	params := utils.GetUrlParams(c)
	users, err := s.userRepository.GetAll(params)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, users)
}

func (s *userService) GetById(c *gin.Context) {
	params := utils.GetUrlParams(c)
	id, _ := utils.GetId(c)

	user, err := s.userRepository.GetByID(uint(id), &params.Populate)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, user)
}

func (s *userService) UpdateUser(c *gin.Context) {
	dto := userDto.UpdateUserDTO{}
	err := c.BindJSON(&dto)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	id, _ := utils.GetId(c)
	user := models.User{}
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(404, gin.H{"error": err.Error()})
		return
	}

	// Only update fields that are provided in the DTO
	if dto.Email != "" {
		user.Email = dto.Email
	}
	if dto.FirstName != "" {
		user.FirstName = dto.FirstName
	}
	if dto.LastName != "" {
		user.LastName = dto.LastName
	}
	if dto.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		user.Password = string(hashedPassword)
	}

	if err := s.userRepository.Update(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, user)
}

func (s *userService) DeleteUser(c *gin.Context) {
	id, _ := utils.GetId(c)
	err := s.userRepository.Delete(uint(id))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User deleted successfully"})
}

// AddUserSkills ajoute des compétences et certifications à un utilisateur
func (s *userService) AddUserSkills(c *gin.Context) {
	userID := c.Keys["user_id"]
	candidateID := c.Keys["candidate_id"]
	var dto candidateDto.UpdateUserSkillsDTO
	if err := c.BindJSON(&dto); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	// On ne log plus le DTO entier ici pour éviter trop de bruit
	fmt.Printf("Adding skills/certs for User ID: %d\n", userID.(uint))

	// Appel de la nouvelle fonction AddUserSkills
	if err := s.candidateRepository.SaveCandidateSkills(candidateID.(uint), dto); err != nil {
		fmt.Printf("Error adding skills/certs: %v\n", err)
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Skills and/or certifications added successfully"})
}

// DeleteUserSkill supprime une compétence spécifique pour un utilisateur
func (s *userService) DeleteUserSkill(c *gin.Context) {
	// Récupérer et valider l'ID utilisateur depuis le contexte
	userIDCtx := c.Keys["candidate_id"]
	userID := userIDCtx.(uint)

	var dto candidateDto.UpdateUserSkillsDTO
	if err := c.BindJSON(&dto); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	// Appeler le repository
	if err := s.candidateRepository.DeleteCandidateSkills(userID, dto); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "Skill/Certification association not found"})
		} else {
			fmt.Printf("Error deleting skill/certification association: %v\n", err)
			c.JSON(500, gin.H{"error": "Failed to delete skill association"})
		}
		return
	}

	c.JSON(200, gin.H{"message": "Skills and/or certifications association deleted successfully"})
}
