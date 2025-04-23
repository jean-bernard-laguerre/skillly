package application

import (
	"skillly/pkg/config"
	applicationDto "skillly/pkg/handlers/application/dto"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateApplication(c *gin.Context) {
	dto := applicationDto.CreateApplicationDTO{}
	err := c.BindJSON(&dto)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	jobPostStr := c.Param("id")
	candidateId := c.Keys["candidate_id"]

	// convert jobpost url string to uint64
	jobPostId, err := strconv.ParseUint(jobPostStr, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	dto.CandidateID = candidateId.(uint)
	dto.JobPostID = uint(jobPostId)
	applicationRepository := ApplicationRepository{}
	application, err := applicationRepository.Create(dto, config.DB)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, application)
}

/* func GetMe(c *gin.Context) {
	params := utils.GetUrlParams(c)
	db := config.DB.Model(&models.Application{})


	db.Where("candidate_id = ?", c.Keys["candidate_id"])
}


func GetOfferApplications(c *gin.Context) {

} */
