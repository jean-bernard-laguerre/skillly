package utils

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

// get url params from request
func GetUrlParams(c *gin.Context) QueryParams {

	// get page & convert to int
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		page = 1
	}

	// get pageSize & convert to int if exists
	var pageSize *int
	sizeStr, exists := c.GetQuery("pageSize")
	if exists && sizeStr != "" {
		if size, err := strconv.Atoi(sizeStr); err == nil && size > 0 {
			pageSize = &size
		}
	}
	return QueryParams{
		Page:     page,
		PageSize: pageSize,
		Sort:     c.DefaultQuery("sort", "created_at"),
		Order:    c.DefaultQuery("order", "desc"),
		Populate: c.QueryArray("populate"),
		Filters:  c.QueryMap("filters"),
	}
}

func GetId(c *gin.Context) (uint, error) {
	idStr := c.Param("id")

	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		c.Abort()
	}

	return uint(id), nil
}
