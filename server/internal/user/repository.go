package user

import "gorm.io/gorm"

type Repository interface {
	Create(user *User) error
	FindByEmail(email string)(*User,error)
	Update(user *User) error
	SaveRefreshToken(token *RefreshToken) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) Create(user *User) error {
	return r.db.Create(user).Error
}

func (r *repository) FindByEmail(email string) (*User, error) {
	user:=User{}
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) Update(user *User) error {
	return r.db.Save(user).Error
}

func (r *repository) SaveRefreshToken(token *RefreshToken) error {
	return r.db.Create(token).Error
}