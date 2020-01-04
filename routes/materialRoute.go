package route

import (
	"genMaterials/controllers"

	"github.com/labstack/echo"
)

func MaterialRouteService(e *echo.Echo) {

	e.POST("/material/csv", controllers.AddMaterial)
	e.GET("/material/listall", controllers.GetMaterial)
	e.GET("/material/groupList/:groupCode", controllers.GetMaterialOnGroup)
	e.GET("/material/groups", controllers.GetMaterialGroups)
	e.GET("/material/nestedMaterials", controllers.GetNestedMaterials)

}
