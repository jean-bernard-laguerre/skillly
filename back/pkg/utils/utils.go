package utils

import (
	"strconv"

	"errors"
	"regexp"

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
		Sort:     c.DefaultQuery("sort", "id"),
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
		return uint(0), err
	}

	return uint(id), nil
}

func ValidatePassword(password string) error {
	if len(password) < 8 {
		return errors.New("Le mot de passe doit contenir au moins 8 caractères")
	}
	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		return errors.New("Le mot de passe doit contenir au moins une majuscule")
	}
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		return errors.New("Le mot de passe doit contenir au moins une minuscule")
	}
	if !regexp.MustCompile(`[0-9]`).MatchString(password) {
		return errors.New("Le mot de passe doit contenir au moins un chiffre")
	}
	if !regexp.MustCompile(`[!@#$%^&*]`).MatchString(password) {
		return errors.New("Le mot de passe doit contenir au moins un caractère spécial")
	}
	return nil
}
