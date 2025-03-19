package db_test

import (
	"skillly/pkg/config"
	"testing"
)

func DatabaseConnection(t *testing.T) {
	_, err := config.DB.DB()
	if err != nil {
		t.Fatalf("Error getting DB connection: %v", err)
	}
}
