package candidateDto

type UpdateUserSkillsDTO struct {
	Skills         []uint `json:"skills"`
	Certifications []uint `json:"certifications"`
}
