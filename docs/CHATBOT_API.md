# AgriBot Chatbot API Documentation

Updated contract: three routes only, wired directly to the two-table schema (`chat`, `message`). Every request must include the `user_id` in the body (JSON). For clients that cannot send a JSON body with `GET`, add `user_id` as a query string parameter; the backend will check both locations.

## Base URL

```
http://localhost:3000/api/chatbot
```

---

## Quick Start

```bash
# Send a new message and receive the bot response
curl -X POST http://localhost:3000/api/chatbot/messages \
  -H "Content-Type: application/json" \
  -d '{
        "user_id": 42,
        "message": "شحال تمن الطماطم اليوم؟"
      }'

# Read the latest 20 messages (inverse order)
curl -X GET "http://localhost:3000/api/chatbot/messages?limit=20" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 42}'

# Delete a specific message
curl -X DELETE http://localhost:3000/api/chatbot/messages/1287 \
  -H "Content-Type: application/json" \
  -d '{"user_id": 42}'
```

---

## Endpoints

### 1. Send Message (Write Route)

**POST** `/messages`

Request body:

```json
{
  "user_id": 42,
  "message": "كيفاش نتعامل مع مرض البطاطا؟"
}
```

Response:

```json
{
  "success": true,
  "chatId": 15,
  "userMessage": {
    "id": 901,
    "text": "كيفاش نتعامل مع مرض البطاطا؟",
    "timestamp": "2024-11-30T10:15:22.821Z"
  },
  "botMessage": {
    "id": 902,
    "text": "راقب الأوراق ...",
    "timestamp": "2024-11-30T10:15:24.078Z"
  },
  "intent": "disease_help",
  "confidence": 0.94,
  "sources": [],
  "searchPerformed": false,
  "userContextUsed": true,
  "metadata": {
    "totalTime": 1875,
    "aiTime": 1421,
    "tokensUsed": 512
  }
}
```

### 2. Read Messages (Read Route)

**GET** `/messages`

Parameters (query string or JSON body):

- `user_id` **(required)** – identifies the single chat assigned to the user
- `limit` _(optional)_ – 1..100, default `50`
- `before` _(optional)_ – message ID cursor; returns messages with IDs `< before`

Response:

```json
{
  "success": true,
  "chatId": 15,
  "messages": [
    {
      "id": 902,
      "text": "راقب الأوراق ...",
      "isUser": false,
      "timestamp": "2024-11-30T10:15:24.078Z"
    },
    {
      "id": 901,
      "text": "كيفاش نتعامل مع مرض البطاطا؟",
      "isUser": true,
      "timestamp": "2024-11-30T10:15:22.821Z"
    }
  ],
  "pagination": {
    "hasMore": true,
    "hasPrevious": true,
    "nextCursor": 875,
    "previousCursor": 902,
    "total": 184,
    "pageSize": 2
  }
}
```

Messages are returned in inverse chronological order (newest first). Use `nextCursor` as the `before` value to fetch the next page.

### 3. Delete Message (Delete Route)

**DELETE** `/messages/:messageId`

Body:

```json
{
  "user_id": 42
}
```

Response (success):

```json
{
  "success": true
}
```

Possible errors:

- `404` – message not found for that user
- `400` – invalid identifiers

---

## Pagination Rules

- Cursor-based, using message IDs.
- Always ordered `DESC` by `created_at` (latest message first).
- `limit` is clamped between `1` and `100`.
- `hasPrevious` flips to `true` as soon as a `before` cursor is supplied.

---

## Language + Intent Support

- **Language mirroring**: Darja (primary), Modern Standard Arabic, French, English.
- **Adaptive prompt** ensures the bot answers using the detected language.
- Intents detected: `price_inquiry`, `weather_query`, `crop_advice`, `disease_help`, `yield_prediction`, `fertilizer_advice`, `irrigation`, `general_inquiry`.

---

## Error Shapes

```json
{
  "success": false,
  "error": "user_id and message are required"
}
```

```json
{
  "success": false,
  "error": "Message not found"
}
```

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

---

## Operational Notes

- No authentication layer; `user_id` travels inside the request body.
- Single chat row per user; deleting a message keeps the chat and recalculates counters.
- Responses include metadata about AI latency, token usage, and context utilization.

---

## Support

Contact the AgriBot platform team for onboarding keys or troubleshooting.
