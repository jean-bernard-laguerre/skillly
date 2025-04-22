package company

import (
	"skillly/pkg/config"
	"skillly/pkg/models"
	"skillly/pkg/utils"

	"github.com/gin-gonic/gin"
)

func GetAll(
	c *gin.Context,
) {

	params := utils.GetUrlParams(c)
	db := config.DB.Model(&models.Company{})

	// apply filters
	for key, value := range params.Filters {
		db = db.Where(key, value)
	}

	// apply sorting
	db = db.Order(params.Sort + " " + params.Order)

	// apply pagination
	if params.PageSize != nil {
		db = db.Limit(*params.PageSize).Offset((params.Page - 1) * *params.PageSize)
	}

	// populate fields
	for _, field := range params.Populate {
		db = db.Preload(field)
	}

	var companies []models.Company
	db.Find(&companies)

	c.JSON(200, companies)
}
