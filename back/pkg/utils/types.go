package utils

// RoleType defines the available roles for a user
type RoleType string
type ContractType string
type CompanyRole string
type RecruiterState string

type QueryParams struct {
	Page     int
	PageSize *int
	Sort     string
	Order    string
	Populate []string
	Filters  map[string]string
}
