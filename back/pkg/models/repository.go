package models

import (
	"skillly/pkg/utils"

	"gorm.io/gorm"
)

type Repository[T any] interface {
	Create(entity *T) error
	GetByID(id uint, populate *[]string) (T, error)
	GetAll(params utils.QueryParams) ([]T, error)
	Update(entity *T) error
	Delete(id uint) error
}

type gormRepository[T any] struct {
	db *gorm.DB
}

func NewRepository[T any](db *gorm.DB) Repository[T] {
	return &gormRepository[T]{db: db}
}

func (r *gormRepository[T]) Create(entity *T) error {
	return r.db.Create(entity).Error
}

func (r *gormRepository[T]) GetByID(id uint, populate *[]string) (T, error) {
	var entity T
	query := r.db.Model(new(T)).Where("id = ?", id) // Start query for the specific model type

	if populate != nil {
		for _, field := range *populate {
			if field != "" { // Basic validation
				query = query.Preload(field)
			}
		}
	}

	result := query.First(&entity) // Use First for single record retrieval by ID
	if result.Error != nil {
		// Return the zero value of T along with the error
		var zero T
		return zero, result.Error
	}
	return entity, nil
}

func (r *gormRepository[T]) GetAll(params utils.QueryParams) ([]T, error) {
	var entities []T
	query := r.db.Model(new(T)) // Start query for the specific model type

	// Apply filters
	for key, value := range params.Filters {
		query = query.Where(key+" = ?", value)
	}

	// Apply sorting
	if params.Sort != "" && params.Order != "" {
		query = query.Order(params.Sort + " " + params.Order)
	} else {
		query.Order("id asc") // Default sort
	}

	// Apply pagination
	if params.PageSize != nil && params.Page > 0 {
		offset := (params.Page - 1) * (*params.PageSize)
		query = query.Limit(*params.PageSize).Offset(offset)
	}

	// Apply preloading
	for _, field := range params.Populate {
		if field != "" { // Basic validation
			query = query.Preload(field)
		}
	}

	result := query.Find(&entities)
	return entities, result.Error
}

func (r *gormRepository[T]) Update(entity *T) error {

	return r.db.Save(entity).Error
}

func (r *gormRepository[T]) Delete(id uint) error {
	// Delete requires the type and the condition (ID)
	result := r.db.Delete(new(T), id)
	if result.Error != nil {
		return result.Error
	}
	// Check if any row was actually deleted
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // Or a custom error
	}
	return nil
}
