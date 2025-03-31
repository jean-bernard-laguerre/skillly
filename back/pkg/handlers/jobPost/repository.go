package jobPost

import (
	jobPostDto "skillly/pkg/handlers/jobPost/dto"
	"skillly/pkg/models"

	"gorm.io/gorm"
)

type JobPostRepository struct{}

func (r *JobPostRepository) Create(dto jobPostDto.CreateJobPostDTO, companyId uint, tx *gorm.DB) (models.JobPost, error) {

	jobPost := models.JobPost{
		Description:     dto.Description,
		Title:           dto.Title,
		Location:        dto.Location,
		Contract_type:   dto.Contract_type,
		Salary_range:    dto.Salary_range,
		Expiration_Date: dto.Expiration_Date,
		FileID:          dto.FileID,
		CompanyID:       companyId,
	}

	createdJobPost := tx.Create(&jobPost)
	if createdJobPost.Error != nil {
		return models.JobPost{}, createdJobPost.Error
	}
	return jobPost, nil
}
