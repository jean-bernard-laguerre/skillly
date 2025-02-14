package candidateReview

import (
	candidate "skillly/pkg/handlers/candidateProfile"
	recruiter "skillly/pkg/handlers/recruterProfile"
	"time"
)

// CandidateReview is a struct that represents a candidate review
type CandidateReview struct {
	ID          uint                       `json:"id" gorm:"primaryKey"`
	Comment     string                     `json:"comment"`
	Rating      int                        `json:"rating"`
	CreatedAt   time.Time                  `json:"created_at"`
	CandidateID uint                       `json:"candidate_id"`
	Candidate   candidate.ProfileCandidate `json:"candidate" gorm:"foreignKey:CandidateID;references:ID"`
	AuthorID    uint                       `json:"author_id"`
	Recruiter   recruiter.ProfileRecruiter `json:"recruiter" gorm:"foreignKey:AuthorID;references:ID"`
}
