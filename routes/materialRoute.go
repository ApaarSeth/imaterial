package route

import (
	"material-master/controllers"

	"github.com/labstack/echo"
)

func MaterialRouteService(e *echo.Echo) {

	e.POST("/material/csv", controllers.AddMaterial)
	e.GET("/material/listall", controllers.GetMaterial)
	e.GET("/material/groupList/:groupCode", controllers.GetMaterialOnGroup)

}
