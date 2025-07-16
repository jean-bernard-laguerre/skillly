package message_test

import (
	messageDto "skillly/chat/handlers/message/dto"
	"skillly/pkg/utils"
	testUtils "skillly/test/utils"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func CreateMessage(t *testing.T) {

	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	messageDto := messageDto.CreateMessageDTO{
		Content: "Hello, World!",
		Room:    "test_room",
	}

	message, err := testUtils.MessageRepo.CreateMessage(messageDto)
	require.NoError(t, err, "Failed to create message")

	params.Filters = map[string]string{
		"room": message.Room,
	}
	messages, _ := testUtils.MessageRepo.GetAll(params)

	assert.NotEmpty(t, messages, "Expected to retrieve at least one message")
	assert.Equal(t, message.Content, messages[0].Content, "Expected message content to match")
	assert.Equal(t, message.Room, messages[0].Room, "Expected message room to match")
	assert.Equal(t, message.SenderID, messages[0].SenderID, "Expected message sender ID to match")
	assert.NotEmpty(t, messages[0].CreatedAt, "Expected message creation time to be set")
}

func GetAllMessages(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	messages, err := testUtils.MessageRepo.GetAll(params)
	require.NoError(t, err, "Failed to get all messages")
	assert.NotEmpty(t, messages, "Expected to retrieve at least one message")
}

func DeleteMessage(t *testing.T) {
	context := testUtils.CreateTestContext()
	params := utils.GetUrlParams(context)

	message, err := testUtils.MessageRepo.GetAll(params)
	require.NoError(t, err, "Failed to get message for deletion")
	assert.NotEmpty(t, message, "Expected to retrieve a message for deletion")

	err = testUtils.MessageRepo.Delete(message[0].ID.String())
	require.NoError(t, err, "Failed to delete message")
}
