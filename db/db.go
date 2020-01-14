package db

import (
	"github.com/jmoiron/sqlx"
	"log"
)

type DB struct {
	*sqlx.DB
}

func DBConnect() (*DB, error) {
	db, err := sqlx.Open("postgres", "host=localhost port=5432 user=postgres password=password dbname=materialmaster sslmode=disable")

	if err != nil {
		log.Fatalln(err)
	}
	return &DB{db}, err
}

func SqlxConnect() (*DB, error) {
	// return db
	db, err := DBConnect()

	return db, err
}
