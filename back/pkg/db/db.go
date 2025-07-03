package db

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"os"
	"skillly/pkg/config"
	"skillly/pkg/models"
)

// Init creates a new connection to the database
// db variables are in .env file in :
// DB_USER
// DB_PASSWORD
// DB_NAME

func Init(
	dbUser, dbPassword, dbName, host, port string,
) {
	err := godotenv.Load()

	// Construire la chaîne de connexion
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Paris",
		host, dbUser, dbPassword, dbName, port)

	// Ouvrir une connexion à la base de données
	config.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	log.Println("Connected to database")

	// MIGRATIONS
	config.DB.AutoMigrate(
		&models.File{},
		&models.Company{},
		&models.User{},
		&models.ProfileCandidate{},
		&models.ProfileRecruiter{},
		&models.Certification{},
		&models.Skill{},
		&models.JobPost{},
		&models.CandidateReview{},
		&models.CompanyReview{},
		&models.Application{},
		&models.Match{},
	)
}

func SetupDB() {
	_ = godotenv.Load()

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	host := "postgres"
	port := "5432"

	Init(
		dbUser, dbPassword, dbName, host, port,
	)
}
