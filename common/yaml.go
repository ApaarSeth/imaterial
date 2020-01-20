package common

type Yaml struct {
	Mode string
	Echo echo
}

type echo struct {
	Port   string
	Static string
}

type fluent struct {
	Path   string
	Rotate int
}
