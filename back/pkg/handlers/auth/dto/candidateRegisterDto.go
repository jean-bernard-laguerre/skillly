package authDto

type CandidateRegisterDTO struct {
	FirstName      string `json:"firstName" binding:"required"`
	LastName       string `json:"lastName" binding:"required"`
	Email          string `json:"email" binding:"required"`
	Password       string `json:"password" binding:"required"`
	Bio            string `json:"bio"`
	ExperienceYear int    `json:"experienceYears"`
	PreferedJob    string `json:"preferedJob"`
	Location       string `json:"location"`
	Availability   string `json:"availability"`
	ResumeID       uint   `json:"resumeID"`
	Certifications []uint `json:"certifications"`
	Skills         []uint `json:"skills"`
}
