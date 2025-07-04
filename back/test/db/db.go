package db_test

import (
	"context"
	chatConfig "skillly/chat/config"
	"skillly/pkg/config"
	"slices"
	"testing"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func PostgresDatabaseConnection(t *testing.T) {
	_, err := config.DB.DB()
	if err != nil {
		t.Fatalf("Error getting DB connection: %v", err)
	}
}

func MongoDatabaseConnection(t *testing.T) {
	if chatConfig.DBMongo == nil {
		t.Fatal("MongoDB connection is nil")
	}

	err := chatConfig.DBMongo.Client().Ping(context.TODO(), nil)
	if err != nil {
		t.Fatalf("Error pinging MongoDB: %v", err)
	}
}

func PostgresTableCheck(t *testing.T) {
	tables := []string{
		"applications", "candidate_reviews", "certifications", "companies",
		"company_reviews", "files", "job_posts", "matches", "profile_candidates",
		"profile_recruiters", "skills", "users",
	}
	for _, table := range tables {
		check := config.DB.Migrator().HasTable(table)
		if !check {
			t.Fatalf("Table %v not found", table)
		} else {
			t.Logf("Table %v found", table)
		}
	}
}

func MongoCollectionCheck(t *testing.T) {
	collections := []string{
		"room", "message",
	}

	dbCollections, err := chatConfig.DBMongo.ListCollectionNames(context.TODO(), bson.D{})

	if err != nil {
		t.Fatalf("Error listing collections: %v", err)
	}

	for _, collection := range collections {
		if !slices.Contains(dbCollections, collection) {
			t.Fatalf("Collection %v not found in MongoDB", collection)
		} else {
			t.Logf("Collection %v found in MongoDB", collection)
		}
	}
}
