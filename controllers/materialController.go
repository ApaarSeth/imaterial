package controllers

import (
	"io"
	"os"
	"path/filepath"

	"material-master/log"
	"material-master/services"
	"net/http"

	"github.com/labstack/echo"
)

var appLog *log.AppLogger

func AddMaterial(c echo.Context) error {
	// Read file
	// Source
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()
	// Destination
	dst, err := os.Create(file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()
	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}
	// fmt.Printf("file Name:" + file.Filename)
	appLog.Info("File is recived sucessfully" + file.Filename)
	fileWithAbsolutePath, fileErr := filepath.Abs(file.Filename)
	appLog.Info("file is Strored at:" + fileWithAbsolutePath)
	if fileErr != nil {
		return fileErr
	}
	services.Uploadcsvfile(fileWithAbsolutePath)
	return c.String(http.StatusOK, "response")
}

func GetMaterial(c echo.Context) error {
	materialsList, ServiceError := services.GetAllMaterials()
	if ServiceError != nil {
		return c.JSON(http.StatusInternalServerError, ServiceError.Error())
	}

	return c.JSON(http.StatusOK, materialsList)
}

func GetMaterialOnGroup(c echo.Context) error {
	groupCode := c.Param("groupCode")
	materialsList, ServiceError := services.GetMaterialsOnGroup(groupCode)
	if ServiceError != nil {
		return c.JSON(http.StatusInternalServerError, ServiceError.Error())
	}

	return c.JSON(http.StatusOK, materialsList)
}
