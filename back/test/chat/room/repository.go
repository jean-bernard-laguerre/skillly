package room_test

import (
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func CreateRoom(t *testing.T) {
	room, err := testUtils.RoomRepo.CreateRoom("test_room")
	require.NoError(t, err, "Failed to create room")

	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	params.Filters = map[string]string{
		"name": room.Name,
	}
	createdRoom, err := testUtils.RoomRepo.GetAll(params)
	require.NoError(t, err, "Failed to get created room")
	assert.NotEmpty(t, createdRoom, "Expected to retrieve at least one room")

	assert.Equal(t, room.Name, createdRoom[0].Name, "Expected room name to match")
	assert.NotEmpty(t, createdRoom[0].ID, "Expected room ID to be set")
}

func GetRoomByID(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	room, err := testUtils.RoomRepo.GetByID("test_room", &params.Populate)
	require.NoError(t, err, "Failed to get room by ID")
	assert.Equal(t, "test_room", room.Name, "Expected room name to match")
}

func GetAllRooms(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	rooms, err := testUtils.RoomRepo.GetAll(params)
	require.NoError(t, err, "Failed to get all rooms")
	assert.NotEmpty(t, rooms, "Expected to retrieve at least one room")
}

func UpdateRoom(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	room, err := testUtils.RoomRepo.GetByID("test_room", &params.Populate)
	require.NoError(t, err, "Failed to get room for update")

	room.Name = "updated_room"
	err = testUtils.RoomRepo.Update(&room)
	require.NoError(t, err, "Failed to update room")

	updatedRoom, err := testUtils.RoomRepo.GetByID("updated_room", &params.Populate)
	require.NoError(t, err, "Failed to get updated room")
	assert.Equal(t, "updated_room", updatedRoom.Name, "Expected updated room name to match")
}

func DeleteRoom(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	err := testUtils.RoomRepo.Delete("updated_room")
	require.NoError(t, err, "Failed to delete room")

	// Verify room is deleted
	_, err = testUtils.RoomRepo.GetByID("updated_room", &params.Populate)
	assert.Error(t, err, "Expected error when getting deleted room")
}
