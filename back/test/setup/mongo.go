package setup

import (
	"log"
	"os"
	"skillly/chat/config"
	chatDB "skillly/chat/db"
)

func SetupTestMongo() {
	dbUser := os.Getenv("TEST_DB_USER")
	dbPassword := os.Getenv("TEST_DB_PASSWORD")
	dbName := os.Getenv("TEST_DB_NAME")

	if dbUser == "" || dbPassword == "" || dbName == "" {
		log.Fatal("Set 'DB_USER', 'DB_PASSWORD' and 'DB_NAME' environment variables")
	}

	chatDB.InitMongoDB(dbUser, dbPassword, dbName)
}

func CleanupTestMongo() {
	if config.DBMongo != nil {

		// Drop the test database
		err := config.DBMongo.Drop(nil)
		if err != nil {
			log.Printf("Failed to drop test MongoDB database: %v", err)
		} else {
			log.Println("Test MongoDB database dropped successfully")
		}
		// Close the MongoDB connection
		err = config.DBMongo.Client().Disconnect(nil)
		if err != nil {
			log.Printf("Failed to disconnect from MongoDB: %v", err)
		} else {
			log.Println("Disconnected from MongoDB")
		}
	}
}
