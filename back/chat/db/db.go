package chatDB

import (
	"log"
	"os"
	"skillly/chat/config"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func InitMongoDB(
	dbUser, dbPassword, dbName string,
) {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("Set 'MONGO_URI' environment variable")
	}

	credential := options.Credential{
		AuthSource: "admin", // Default auth source
		Username:   dbUser,
		Password:   dbPassword,
	}

	clientOptions := options.Client().ApplyURI(mongoURI).SetAuth(credential)
	client, err := mongo.Connect(nil, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(nil, nil)

	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	config.DBMongo = client.Database(dbName)

	config.DBMongo.Collection("room")
	config.DBMongo.Collection("message")

	log.Printf("Connected to MongoDB database: %s", dbName)
}

func SetupDB() {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" || dbPassword == "" || dbName == "" {
		log.Fatal("Set 'DB_USER', 'DB_PASSWORD' and 'DB_NAME' environment variables")
	}

	InitMongoDB(dbUser, dbPassword, dbName)
}
