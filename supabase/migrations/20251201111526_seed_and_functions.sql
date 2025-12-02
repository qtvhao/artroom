-- Seed data for room
INSERT INTO room (id) VALUES
    ('00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000002'),
    ('00000000-0000-0000-0000-000000000003');

-- Function: clear - Clears all canvases for a room
CREATE OR REPLACE FUNCTION clear(p_room_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM canvas WHERE room_id = p_room_id;
END;
$$;

-- Function: update_canva_data - Updates or creates a canvas and returns room info
CREATE OR REPLACE FUNCTION update_canva_data(
    p_room_id UUID,
    p_canvas_id UUID DEFAULT NULL,
    p_image_data_svg TEXT DEFAULT NULL,
    p_canvas_data TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_canvas_id UUID;
    v_result JSON;
BEGIN
    -- Create room if it doesn't exist
    INSERT INTO room (id)
    VALUES (p_room_id)
    ON CONFLICT (id) DO NOTHING;

    -- Update existing canvas or create new one
    IF p_canvas_id IS NOT NULL THEN
        -- Update existing canvas
        UPDATE canvas
        SET image_data_svg = COALESCE(p_image_data_svg, image_data_svg),
            canvas_data = COALESCE(p_canvas_data, canvas_data),
            updated_at = now()
        WHERE id = p_canvas_id AND room_id = p_room_id
        RETURNING id INTO v_canvas_id;

        -- If canvas not found, create new one
        IF v_canvas_id IS NULL THEN
            INSERT INTO canvas (id, room_id, image_data_svg, canvas_data)
            VALUES (p_canvas_id, p_room_id, p_image_data_svg, p_canvas_data)
            RETURNING id INTO v_canvas_id;
        END IF;
    ELSE
        -- Create new canvas
        INSERT INTO canvas (room_id, image_data_svg, canvas_data)
        VALUES (p_room_id, p_image_data_svg, p_canvas_data)
        RETURNING id INTO v_canvas_id;
    END IF;

    -- Build response with canvas_id and room_info
    SELECT json_build_object(
        'canvas_id', v_canvas_id,
        'room_info', json_build_object(
            'canvas', (
                SELECT json_agg(
                    json_build_object(
                        'id', c.id,
                        'image_data_svg', c.image_data_svg,
                        'canvas_data', c.canvas_data
                    )
                )
                FROM canvas c
                WHERE c.room_id = p_room_id
            )
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$;
