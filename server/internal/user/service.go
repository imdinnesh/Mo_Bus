package user

type Service interface {
	Register(req SignUpRequest) (*SignUpResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) Register(req SignUpRequest) (*SignUpResponse, error) {
	user := &User{
        Name:    req.Name,
        Email:   req.Email,
        Password: req.Password,
	}

	err:=s.repo.Create(user)
    if err != nil {
        return nil, err
    }

	return &SignUpResponse{
        Status: "success",
        Message: "User registered successfully",
    }, nil

}
