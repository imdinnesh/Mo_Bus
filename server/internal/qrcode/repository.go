package qrcode

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	FindBookingsByID(id uint) (*models.Booking, error)
	SaveBookingStatus(booking *models.Booking) error
	CreateQrCode(qrCode *models.QrCode) error
	FindQrCodeByBookingID(bookingID string) (*models.QrCode, error)
	SaveQrCode(qrCode *models.QrCode) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindBookingsByID(id uint) (*models.Booking, error) {
	booking := models.Booking{}
	err := r.db.Where("id = ?", id).First(&booking).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *repository) SaveBookingStatus(booking *models.Booking) error {
	err := r.db.Save(booking).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) CreateQrCode(qrCode *models.QrCode) error {
	err := r.db.Create(qrCode).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) FindQrCodeByBookingID(bookingID string) (*models.QrCode, error) {
	qrCode := models.QrCode{}
	err := r.db.Where("booking_id = ?", bookingID).First(&qrCode).Error
	if err != nil {
		return nil, err
	}
	return &qrCode, nil
}

func (r *repository) SaveQrCode(qrCode *models.QrCode) error {
	err := r.db.Save(qrCode).Error
	if err != nil {
		return err
	}
	return nil
}
