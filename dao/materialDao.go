package dao

import (
	"fmt"
	"genMaterials/db"
	"genMaterials/log"
	"genMaterials/model"
	"strconv"
	"strings"
)

var appLog *log.AppLogger

type materialDao struct{}

type MaterialDaoIF interface {
	AddMaterial(newMaterial []*model.Material) ([]model.Material, error)
	GetAllMaterials() ([]model.Material, error)
	GetMaterialsOnGroup(groupCode string) ([]model.Material, error)
	GetMaterialGroups() ([]model.Material, error)
	GetNestedMaterials(pid *model.Pids) ([]model.MaterialsObj, error)
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

	vals := []interface{}{}
	for _, row := range materialsList {
		vals = append(vals, row.Pid, row.MaterialCode, row.MaterialGroupName, row.Discription, row.MaterialName, row.BasePrice, row.Gst, row.CreatedAt, row.CreatedBy, row.LastUpdatedBy, row.LastUpdatedAt)
	}

	sqlStr := `INSERT INTO materials (pid,material_code,material_group,discription,material_name,base_price,gst,created_at,created_by,last_updated_by,last_updated_at) VALUES %s`
	sqlStr = ReplaceSQL(sqlStr, "(?,?,?,?,?,?,?,?,?,?,?)", len(materialsList))
	//Prepare and execute the statement
	stmt, _ := db.Prepare(sqlStr)
	res, _ := stmt.Exec(vals...)
	ro, _ := res.RowsAffected()
	appLog.Info("Number of reows Insterd" + string(ro))
	defer db.Close()
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
	defer db.Close()
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
				     materials where pid=$1
				`
	selectQueryError := db.Select(&materials, sqlStatement, groupCode)

	if selectQueryError != nil {
		fmt.Printf("The error is: ", selectQueryError)
		return nil, selectQueryError
	}
	defer db.Close()
	return materials, selectQueryError
}

func (self *materialDao) GetMaterialGroups() ([]model.Material, error) {
	appLog.Info("GetMaterialGroups is Called")

	materials := []model.Material{}
	// db, errs := db.DBConnect()
	db, connectionErrors := db.SqlxConnect()
	if connectionErrors != nil {
		fmt.Println(connectionErrors)
		return nil, connectionErrors
	}
	sqlStatement := `select DISTINCT pid,material_group from materials order by pid`
	selectQueryError := db.Select(&materials, sqlStatement)

	if selectQueryError != nil {
		fmt.Printf("The error is: ", selectQueryError)
		return nil, selectQueryError
	}
	defer db.Close()
	return materials, selectQueryError
}

func (self *materialDao) GetNestedMaterials(pids *model.Pids) ([]model.MaterialsObj, error) {
	appLog.Info("GetNestedMaterials is Called")
	var materialObjList = []model.MaterialsObj{}

	// db, errs := db.DBConnect()
	db, connectionErrors := db.SqlxConnect()
	if connectionErrors != nil {
		fmt.Println(connectionErrors)
		return materialObjList, connectionErrors
	}
	for _, groupName := range pids.Pid {
		var materialObj = model.MaterialsObj{}
		materials := []*model.Material{}
		materialObj.MaterialGroupName = groupName
		var pidList []string
		sqlStatement1 := `select pid from materials where material_group=$1`
		selectQueryError1 := db.Select(&pidList, sqlStatement1, groupName)
		materialObj.Pid = pidList[0]
		if selectQueryError1 != nil {
			fmt.Printf("The error is: ", selectQueryError1)
			return materialObjList, selectQueryError1
		}
		sqlStatement2 := `select * from materials where material_group=$1`
		selectQueryError2 := db.Select(&materials, sqlStatement2, groupName)
		if selectQueryError2 != nil {
			fmt.Printf("The error is: ", selectQueryError2)
			return materialObjList, selectQueryError2
		}
		materialObj.Child = materials
		materialObjList = append(materialObjList, materialObj)
	}
	defer db.Close()
	return materialObjList, connectionErrors
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
