package chatDB

import (
	"log"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func InitMongoDB(
	dbUser, dbPassword, dbName, host, port string,
) (*mongo.Client, error) {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("Set 'MONGO_URI' environment variable")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(nil, clientOptions)
	if err != nil {
		return nil, err
	}

	err = client.Ping(nil, nil)

	if err != nil {
		return nil, err
	}

	return client, nil
}

func SetupDB() (*mongo.Client, error) {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	host := "mongodb"
	port := "27017"

	if dbUser == "" || dbPassword == "" || dbName == "" || host == "" || port == "" {
		log.Fatal("Set 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', and 'DB_PORT' environment variables")
	}

	return InitMongoDB(dbUser, dbPassword, dbName, host, port)
}
