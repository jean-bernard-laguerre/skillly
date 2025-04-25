package user

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"skillly/pkg/config"
	userDto "skillly/pkg/handlers/user/dto"
	"skillly/pkg/models"
)

type UserRepository interface {
	models.Repository[models.User]
	CreateUser(dto userDto.CreateUserDTO, tx *gorm.DB) (models.User, error)
	GetByEmail(email string) (models.User, error)
	/* AddUserSkills(userID uint, dto userDto.UpdateUserSkillsDTO) error
	DeleteUserSkill(userID uint, skillID uint) error
	DeleteUserCertification(userID uint, certificationID uint) error */
}

type userRepository struct {
	models.Repository[models.User]
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{
		Repository: models.NewRepository[models.User](db),
		db:         db,
	}
}

// Create a new user
func (r *userRepository) CreateUser(dto userDto.CreateUserDTO, tx *gorm.DB) (models.User, error) {
	// Hash the password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}

	user := models.User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
		Password:  string(hashPassword),
		Role:      dto.Role,
	}

	createdUser := tx.Create(&user)
	if createdUser.Error != nil {
		return models.User{}, createdUser.Error
	}

	return user, nil
}

func (r *userRepository) GetByEmail(email string) (models.User, error) {
	var user models.User
	// Preload associated profiles and their associations when fetching by Email
	result := config.DB.Preload("ProfileCandidate.Skills").
		Preload("ProfileCandidate.Certifications").
		Preload("ProfileRecruiter").
		Where("email = ?", email).First(&user)
	if result.Error != nil {
		return models.User{}, result.Error
	}
	return user, nil
}

// AddUserSkills adds skills and certifications to a user without removing existing ones
/* func (r *userRepository) AddUserSkills(userID uint, dto userDto.UpdateUserSkillsDTO) error {
	var user models.User
	if err := config.DB.Preload("ProfileCandidate").First(&user, userID).Error; err != nil {
		fmt.Printf("Error finding user: %v\n", err)
		return err
	}

	if user.ProfileCandidate == nil {
		fmt.Printf("No profile candidate found for user %d\n", userID)
		return gorm.ErrRecordNotFound
	}

	// Ajouter les nouvelles compétences si fournies
	if dto.Skills != nil {
		for _, skillID := range dto.Skills {
			// Vérifier si l'association existe déjà pour éviter les doublons (optionnel, dépend de la contrainte DB)
			var count int64
			config.DB.Table("user_skills").Where("profile_candidate_id = ? AND skill_id = ?", user.ProfileCandidate.ID, skillID).Count(&count)
			if count == 0 {
				if err := config.DB.Exec("INSERT INTO user_skills (profile_candidate_id, skill_id) VALUES (?, ?)",
					user.ProfileCandidate.ID, skillID).Error; err != nil {
					fmt.Printf("Error inserting skill %d: %v\n", skillID, err)
					// On pourrait choisir de continuer même si une insertion échoue
					// return err
				}
			}
		}
	}

	// Ajouter les nouvelles certifications si fournies
	if dto.Certifications != nil {
		for _, certID := range dto.Certifications {
			// Vérifier si l'association existe déjà
			var count int64
			config.DB.Table("user_certifications").Where("profile_candidate_id = ? AND certification_id = ?", user.ProfileCandidate.ID, certID).Count(&count)
			if count == 0 {
				if err := config.DB.Exec("INSERT INTO user_certifications (profile_candidate_id, certification_id) VALUES (?, ?)",
					user.ProfileCandidate.ID, certID).Error; err != nil {
					fmt.Printf("Error inserting certification %d: %v\n", certID, err)
					// return err
				}
			}
		}
	}

	return nil
}

// DeleteUserSkill supprime une association compétence-utilisateur spécifique
func (r *userRepository) DeleteUserSkill(userID uint, skillID uint) error {
	var user models.User
	if err := config.DB.Preload("ProfileCandidate").First(&user, userID).Error; err != nil {
		return err // Utilisateur non trouvé
	}
	if user.ProfileCandidate == nil {
		return gorm.ErrRecordNotFound // Profil candidat non trouvé
	}

	result := config.DB.Exec("DELETE FROM user_skills WHERE profile_candidate_id = ? AND skill_id = ?",
		user.ProfileCandidate.ID, skillID)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // Relation non trouvée
	}
	return nil
}

// DeleteUserCertification supprime une association certification-utilisateur spécifique
func (r *userRepository) DeleteUserCertification(userID uint, certificationID uint) error {
	var user models.User

	result := config.DB.Exec("DELETE FROM user_certifications WHERE profile_candidate_id = ? AND certification_id = ?",
		user.ProfileCandidate.ID, certificationID)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // Relation non trouvée
	}
	return nil
}
*/
