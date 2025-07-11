package models

import (
	"fmt"
	"log"
	"reflect"
	"skillly/pkg/utils"
	"strings"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Repository[T any] interface {
	Create(entity *T) error
	GetByID(id string, populate *[]string) (T, error)
	GetAll(params utils.QueryParams) ([]T, error)
	Update(entity *T) error
	Delete(id string) error
}

type mongoRepository[T any] struct {
	db *mongo.Database
}

func NewRepository[T any](db *mongo.Database) Repository[T] {
	return &mongoRepository[T]{db: db}
}

func (r *mongoRepository[T]) getCollectionName() string {
	var entity T
	t := reflect.TypeOf(entity)

	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	return strings.ToLower(t.Name())
}

func (r *mongoRepository[T]) Create(entity *T) error {
	collectionName := r.getCollectionName()
	fmt.Printf("Inserting entity into collection: %s\n", collectionName)
	collection := r.db.Collection(collectionName)
	_, err := collection.InsertOne(nil, entity)
	if err != nil {
		log.Printf("Error inserting entity: %v", err)
		return err
	}
	return nil
}

func (r *mongoRepository[T]) GetByID(id string, populate *[]string) (T, error) {
	collectionName := r.getCollectionName()
	collection := r.db.Collection(collectionName)

	var entity T
	err := collection.FindOne(nil, map[string]interface{}{"_id": id}).Decode(&entity)
	if err != nil {
		log.Printf("Error finding entity by ID %s: %v", id, err)
		return entity, err
	}

	if populate != nil {
		// Handle population logic if needed
	}

	return entity, nil
}

func (r *mongoRepository[T]) GetAll(params utils.QueryParams) ([]T, error) {
	collectionName := r.getCollectionName()
	collection := r.db.Collection(collectionName)

	filter := map[string]interface{}{}
	if params.Filters != nil {
		for key, value := range params.Filters {
			if value != "" {
				filter[key] = value
			}
		}
	}

	options := options.Find()
	options.SetSort(params.Sort)
	if params.Order == "asc" {
		options.SetSort(map[string]int{params.Sort: 1})
	} else {
		options.SetSort(map[string]int{params.Sort: -1})
	}

	cursor, err := collection.Find(nil, filter, options)
	if err != nil {
		log.Printf("Error finding entities: %v", err)
		return []T{}, err
	}
	defer cursor.Close(nil)

	var entities []T
	count := 0
	for cursor.Next(nil) {
		var entity T
		if err := cursor.Decode(&entity); err != nil {
			log.Printf("Error decoding entity: %v", err)
			return []T{}, err
		}
		entities = append(entities, entity)
		count++
	}

	if entities == nil {
		entities = []T{}
	}

	return entities, nil
}

func (r *mongoRepository[T]) Update(entity *T) error {
	collectionName := r.getCollectionName()
	collection := r.db.Collection(collectionName)

	filter := map[string]interface{}{"_id": entity}
	update := map[string]interface{}{"$set": entity}

	_, err := collection.UpdateOne(nil, filter, update)
	if err != nil {
		log.Printf("Error updating entity: %v", err)
		return err
	}
	return nil
}

func (r *mongoRepository[T]) Delete(id string) error {
	collectionName := r.getCollectionName()
	collection := r.db.Collection(collectionName)

	_, err := collection.DeleteOne(nil, map[string]interface{}{"_id": id})
	if err != nil {
		log.Printf("Error deleting entity by ID %s: %v", id, err)
		return err
	}
	return nil
}
