package matchDto

// CreateMatchDTO defines the structure for the data required to create a match
type CreateMatchDTO struct {
	CandidateID   uint `json:"candidate_id" binding:"required"`
	JobPostID     uint `json:"job_post_id" binding:"required"`
	ApplicationID uint `json:"application_id" binding:"required"`
}
