package userDto

type UpdateUserDTO struct {
	FirstName string `json:"firstName""`
	LastName  string `json:"lastName""`
	Email     string `json:"email"`
	Password  string `json:"password"`
}
