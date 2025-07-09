package db_test

import (
	"context"
	"fmt"
	chatConfig "skillly/chat/config"
	"skillly/pkg/config"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func PostgresDatabaseConnection(t *testing.T) {
	_, err := config.DB.DB()
	require.NoError(t, err, "Failed to get Postgres DB connection")
}

func MongoDatabaseConnection(t *testing.T) {
	assert.NotNil(t, chatConfig.DBMongo, "MongoDB connection should not be nil")

	err := chatConfig.DBMongo.Client().Ping(context.TODO(), nil)
	require.NoError(t, err, "Failed to ping MongoDB")
}

func PostgresTableCheck(t *testing.T) {
	tables := []string{
		"applications", "candidate_reviews", "certifications", "companies",
		"company_reviews", "files", "job_posts", "matches", "profile_candidates",
		"profile_recruiters", "skills", "users",
	}
	for _, table := range tables {
		check := config.DB.Migrator().HasTable(table)
		assert.True(t, check, fmt.Sprintf("Table %v should exist", table))
	}
}

func MongoCollectionCheck(t *testing.T) {
	collections := []string{
		"room", "message",
	}

	dbCollections, err := chatConfig.DBMongo.ListCollectionNames(context.TODO(), bson.D{})
	fmt.Printf("MongoDB Collections: %v\n", dbCollections)

	require.NoError(t, err, "Failed to list MongoDB collections")
	assert.NotEmpty(t, dbCollections, "MongoDB collections should not be empty")

	for _, collection := range collections {
		assert.Contains(t, dbCollections, collection, fmt.Sprintf("Collection %v should exist in MongoDB", collection))
		/* if !slices.Contains(dbCollections, collection) {
			t.Fatalf("Collection %v not found in MongoDB", collection)
		} else {
			t.Logf("Collection %v found in MongoDB", collection)
		} */
	}
}
