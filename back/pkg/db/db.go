package db

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"skillly/pkg/config"
	"skillly/pkg/handlers/application"
	candidate "skillly/pkg/handlers/candidateProfile"
	"skillly/pkg/handlers/candidateReview"
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/company"
	"skillly/pkg/handlers/companyReview"
	"skillly/pkg/handlers/file"
	"skillly/pkg/handlers/jobPost"
	"skillly/pkg/handlers/match"
	recruiter "skillly/pkg/handlers/recruiterProfile"
	"skillly/pkg/handlers/skill"
	"skillly/pkg/handlers/user"
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

	/* dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	host := "postgres"
	port := "5432" */

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
		&file.File{},
		&company.Company{},
		&user.User{},
		&candidate.ProfileCandidate{},
		&recruiter.ProfileRecruiter{},
		&certification.Certification{},
		&skill.Skill{},
		&jobPost.JobPost{},
		&candidateReview.CandidateReview{},
		&companyReview.CompanyReview{},
		&application.Application{},
		&match.Match{},
	)
}
