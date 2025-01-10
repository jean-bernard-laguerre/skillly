package models

// ProfileCandidate is a struct that represents a candidate user
type ProfileCandidate struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	User     User   `json:"user" gorm:"embedded;embeddedPrefix:user_"`
	Bio	  string `json:"bio"`
	ExperienceYear int `json:"experience_year"`
	PreferedJobType string `json:"prefered_job_type"`
	Location string `json:"location"`
	Availability string `json:"availability"`
	Resume File `json:"resume" gorm:"embedded;embeddedPrefix:resume_"`
	Certifications []Certification `json:"certifications" gorm:"many2many:profile_candidate_certifications;"`
}
