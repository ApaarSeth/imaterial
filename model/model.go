package model

import (
	"time"
)

type Base struct {
	ID            int       `json:"id"`
	CreatedBy     string    `json:"created_by" db:"created_by"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	LastUpdatedBy string    `json:"last_updated_by" db:"last_updated_by"`
	LastUpdatedAt time.Time `json:"last_updated_at" db:"last_updated_at"`
}

type Material struct {
	Base
	Pid               string   `json:"pid"    db:"pid"`
	MaterialCode      string   `json:"materialCode"    db:"material_code"`
	Discription       string   `json:"discription"       db:"discription"`
	MaterialName      string   `json:"materialName"    db:"material_name"`
	MaterialGroupName string   `json:"materialGroup"    db:"material_group"`
	MaterialUnit      string   `json:"materialUnit"      db:"material_unit"`
	BasePrice         float64  `json:"basePrice"     db:"base_price"`
	Gst               int      `json:"gst"  db:"gst"`
	Alias             string   `json:"alias"    db:"alias"`
	Specs             []string `json:"Specs"    db:"specs"`
}

type MaterialResultJson struct {
	MaterialID    string `json:"materialID"`
	MaterialCode  string `json:"materialCode"`
	MaterialName  string `json:"materialName"`
	MaterialGroup string `json:"materialGroup"`
	MaterialUnit  string `json:"materialUnit"`
	BasePrice     uint64 `json:"basePrice"`
	Gst           int    `json:"gst"  db:"gst"`
	Alias         string `json:"alias"    db:"alias"`
}

type Pids struct {
	Pid []string `json:"pid"`
}

type MaterialsObj struct {
	Pid               string `json:"pid"  db:"pid"`
	MaterialGroupName string `json:"materialGroup"    db:"material_group"`
	Child             []*Material
}
