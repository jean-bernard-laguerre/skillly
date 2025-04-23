package applicationDto

type CreateApplicationDTO struct {
	CoverLetterID uint `json:"cover_id"`
	Score         int  `json:"score"`

	// from the url params & the middleware
	CandidateID uint `json:"candidate_id`
	JobPostID   uint `json:"jobpost_id"`
}
