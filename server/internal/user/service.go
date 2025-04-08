package user

type Service interface {
    CreateUser(user User) (User, error)
}

type service struct {
    repo Repository
}

func NewService(r Repository) Service {
    return &service{repo: r}
}

func (s *service) CreateUser(user User) (User, error) {
    return s.repo.Create(user)
}
