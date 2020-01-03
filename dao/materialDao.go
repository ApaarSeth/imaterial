package dao

import (
	"fmt"
	"material-master/db"
	"material-master/log"
	"material-master/model"
	"strconv"
	"strings"
)

var appLog *log.AppLogger

type materialDao struct{}

type MaterialDaoIF interface {
	AddMaterial(newMaterial []*model.Material) ([]model.Material, error)
	GetAllMaterials() ([]model.Material, error)
	GetMaterialsOnGroup(groupCode string) ([]model.Material, error)
}

func MaterialDao() MaterialDaoIF {
	return &materialDao{}
}

func (self *materialDao) AddMaterial(materialsList []*model.Material) ([]model.Material, error) {

	materials := []model.Material{}

	// db, errs := db.DBConnect()
	db, ConnectionErrs := db.SqlxConnect()
	if ConnectionErrs != nil {
		return nil, ConnectionErrs
	}
	var err error
	// for _, m := range materialsList {

	// 	sqlStatement := `INSERT INTO materials (pid,material_code,material_group,discription,material_name,base_price,gst,created_at,created_by,last_updated_by,last_updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`

	// 	_, err := db.Query(sqlStatement, m.Pid, m.MaterialCode, m.MaterialGroup, m.Discription, m.MaterialName, m.BasePrice, m.Gst, m.CreatedAt, m.CreatedBy, m.LastUpdatedBy, m.LastUpdatedAt)
	// 	if err != nil {
	// 		fmt.Println(err)
	// 	}
	// }
	vals := []interface{}{}
	for _, row := range materialsList {
		vals = append(vals, row.Pid, row.MaterialCode, row.MaterialGroup, row.Discription, row.MaterialName, row.BasePrice, row.Gst, row.CreatedAt, row.CreatedBy, row.LastUpdatedBy, row.LastUpdatedAt)
	}

	sqlStr := `INSERT INTO materials (pid,material_code,material_group,discription,material_name,base_price,gst,created_at,created_by,last_updated_by,last_updated_at) VALUES %s`
	sqlStr = ReplaceSQL(sqlStr, "(?,?,?,?,?,?,?,?,?,?,?)", len(materialsList))
	// fmt.Println(sqlStr)
	//Prepare and execute the statement
	stmt, _ := db.Prepare(sqlStr)
	res, _ := stmt.Exec(vals...)
	ro, _ := res.RowsAffected()
	appLog.Info("Number of reows Insterd" + string(ro))
	return materials, err
}

func (self *materialDao) GetAllMaterials() ([]model.Material, error) {
	appLog.Info("### dao.GetAllMaterials() called. ###")

	materials := []model.Material{}
	// db, errs := db.DBConnect()
	db, errs := db.SqlxConnect()
	if errs != nil {
		fmt.Println(errs)
		return nil, errs
	}
	sqlStatement := `SELECT
					*	
				     FROM
				     materials
				`
	err := db.Select(&materials, sqlStatement)

	if err != nil {
		fmt.Printf("The error is: ", err)
		return nil, err
	}

	return materials, err
}

func (self *materialDao) GetMaterialsOnGroup(groupCode string) ([]model.Material, error) {
	appLog.Info("GetMaterialsOnGroup is Called")

	materials := []model.Material{}
	// db, errs := db.DBConnect()
	db, connectionErrors := db.SqlxConnect()
	if connectionErrors != nil {
		fmt.Println(connectionErrors)
		return nil, connectionErrors
	}
	sqlStatement := `SELECT
					*	
				     FROM
				     materials where material_group=$1
				`
	selectQueryError := db.Select(&materials, sqlStatement, groupCode)

	if selectQueryError != nil {
		fmt.Printf("The error is: ", selectQueryError)
		return nil, selectQueryError
	}

	return materials, selectQueryError
}

func ReplaceSQL(stmt, pattern string, len int) string {
	pattern += ","
	stmt = fmt.Sprintf(stmt, strings.Repeat(pattern, len))
	n := 0
	for strings.IndexByte(stmt, '?') != -1 {
		n++
		param := "$" + strconv.Itoa(n)
		stmt = strings.Replace(stmt, "?", param, 1)
	}
	return strings.TrimSuffix(stmt, ",")
}
