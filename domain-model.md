# ArtRoom

## Room

- ID

## Canvas

- ID
- image_data_svg
- room_id


# APIs

Base URL: `https://dlieddqvtmtofozednci.supabase.co/rest/v1/rpc`

### Headers (required for all requests)

```
apikey: <SUPABASE_PUBKEY>
Authorization: Bearer <SUPABASE_PUBKEY>
Content-Type: application/json
```

---

## POST - /clear

Clears all canvases for a room.

**Endpoint:** `POST /rpc/clear`

**Request:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| p_room_id | UUID | Yes | The room ID to clear |

**Example:**

```bash
curl -X POST "https://dlieddqvtmtofozednci.supabase.co/rest/v1/rpc/clear" \
  -H "apikey: $SUPABASE_PUBKEY" \
  -H "Authorization: Bearer $SUPABASE_PUBKEY" \
  -H "Content-Type: application/json" \
  -d '{"p_room_id": "00000000-0000-0000-0000-000000000001"}'
```

**Response:** Empty (204 No Content)

---

## POST - /update_canva_data

Creates or updates a canvas and returns the room info with all canvases.

**Endpoint:** `POST /rpc/update_canva_data`

**Request:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| p_room_id | UUID | Yes | The room ID |
| p_canvas_id | UUID | No | Canvas ID to update (creates new if omitted) |
| p_image_data_svg | String | No | SVG image data |
| p_canvas_data | String | No | Canvas JSON data |

**Example:**

```bash
curl -X POST "https://dlieddqvtmtofozednci.supabase.co/rest/v1/rpc/update_canva_data" \
  -H "apikey: $SUPABASE_PUBKEY" \
  -H "Authorization: Bearer $SUPABASE_PUBKEY" \
  -H "Content-Type: application/json" \
  -d '{
    "p_room_id": "00000000-0000-0000-0000-000000000001",
    "p_image_data_svg": "<svg><circle cx=\"50\" cy=\"50\" r=\"40\"/></svg>",
    "p_canvas_data": "{\"objects\":[]}"
  }'
```

**Response:**

```json
{
  "canvas_id": "b652ac8a-3cc4-43f4-a57d-a2787be59568",
  "room_info": {
    "canvas": [
      {
        "id": "b652ac8a-3cc4-43f4-a57d-a2787be59568",
        "image_data_svg": "<svg><circle cx=\"50\" cy=\"50\" r=\"40\"/></svg>",
        "canvas_data": "{\"objects\":[]}"
      }
    ]
  }
}
```

---

## Seed Rooms

Pre-seeded room IDs for testing:

- `00000000-0000-0000-0000-000000000001`
- `00000000-0000-0000-0000-000000000002`
- `00000000-0000-0000-0000-000000000003`
