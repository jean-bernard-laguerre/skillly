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

func TableCheck(t *testing.T) {
	tables := []string{
		"applications", "candidate_reviews", "certifications", "companies",
		"company_reviews", "files", "job_posts", "matches", "profile_candidates",
		"profile_recruiters", "skills", "users",
	}
	for _, table := range tables {
		check := config.DB.Migrator().HasTable(table)
		if !check {
			t.Fatalf("Table %v not found", table)
		}
	}
}
