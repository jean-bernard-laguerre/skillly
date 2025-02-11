package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"skillly/pkg/models"
)

// Init creates a new connection to the database
// db variables are in .env file in :
// DB_USER
// DB_PASSWORD
// DB_NAME
func Init() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	host := "postgres"
	port := "5432"

	// Construire la chaîne de connexion
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Paris",
	host, dbUser, dbPassword, dbName, port)
	

	// Ouvrir une connexion à la base de données
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	log.Println("Connected to database")

	// MIGRATIONS
	db.AutoMigrate(&models.File{}, 
		&models.Company{}, 
		&models.User{}, 
		&models.ProfileCandidate{}, 
		&models.ProfileRecruiter{},
		&models.Certification{},
		// &models.Skill{},
	)



	return db
}
