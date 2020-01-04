package controllers

import (
	"io"
	"os"
	"path/filepath"

	"genMaterials/log"
	"genMaterials/model"
	"genMaterials/services"
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

func GetMaterialGroups(c echo.Context) error {
	// groupCode := c.Param("groupCode")
	materialsList, ServiceError := services.GetMaterialGroups()
	if ServiceError != nil {
		return c.JSON(http.StatusInternalServerError, ServiceError.Error())
	}

	return c.JSON(http.StatusOK, materialsList)
}

func GetNestedMaterials(c echo.Context) error {
	groupNames := new(model.Pids)
	err := c.Bind(groupNames)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	// groupCode := c.Param("groupCode")
	materialsList, ServiceError := services.GetNestedMaterials(groupNames)
	if ServiceError != nil {
		return c.JSON(http.StatusInternalServerError, ServiceError.Error())
	}

	return c.JSON(http.StatusOK, materialsList)
}
