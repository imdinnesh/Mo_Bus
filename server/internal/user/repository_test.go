package user_test

import (
	"testing"
	"time"

	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/internal/user"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})

	require.NoError(t, err)

	err = db.AutoMigrate(&models.User{}, &models.RefreshToken{})
	require.NoError(t, err)

	return db
}

func TestUserRepository(t *testing.T) {
	db := setupTestDB(t)
	repo := user.NewRepository(db)

	t.Run("Create and FindByEmail", func(t *testing.T) {
		u := &models.User{
			Name:  "Test User",
			Email: "test@example.com",
		}

		err := repo.Create(u)
		require.NoError(t, err)
		require.NotZero(t, u.ID)

		found, err := repo.FindByEmail("test@example.com")
		require.NoError(t, err)
		require.Equal(t, u.Email, found.Email)
	})

	t.Run("Update User", func(t *testing.T) {
		u := &models.User{
			Name:  "Old Name",
			Email: "update@example.com",
		}
		require.NoError(t, repo.Create(u))

		u.Name = "Updated Name"
		require.NoError(t, repo.Update(u))

		updated, err := repo.FindById(u.ID)
		require.NoError(t, err)
		require.Equal(t, "Updated Name", updated.Name)
	})

	t.Run("Save and Delete RefreshToken", func(t *testing.T) {
		rt := &models.RefreshToken{
			UserID:    100,
			DeviceID:  "device-123",
			EncryptedRefreshToken:     "some-token",
			ExpiresAt: time.Now().Add(15 * time.Minute),
		}
		require.NoError(t, repo.SaveRefreshToken(rt))

		err := repo.DeleteRefreshToken(rt, 100, "device-123")
		require.NoError(t, err)

		var count int64
		db.Model(&models.RefreshToken{}).Count(&count)
		require.Equal(t, int64(0), count)
	})
}
