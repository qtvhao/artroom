-- Create Room table
CREATE TABLE room (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create Canvas table
CREATE TABLE canvas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    image_data_svg TEXT,
    canvas_data TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for faster lookups by room_id
CREATE INDEX idx_canvas_room_id ON canvas(room_id);

-- Enable Row Level Security
ALTER TABLE room ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
CREATE POLICY "Allow public read access on room" ON room
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on room" ON room
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on canvas" ON canvas
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on canvas" ON canvas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on canvas" ON canvas
    FOR UPDATE USING (true);
