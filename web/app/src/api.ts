const BASE_URL = 'https://dlieddqvtmtofozednci.supabase.co/rest/v1/rpc';

const getHeaders = () => {
  const apiKey = import.meta.env.VITE_SUPABASE_PUBKEY;
  return {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
};

export interface Canvas {
  id: string;
  image_data_svg: string;
  canvas_data?: string;
}

export interface RoomInfo {
  canvas: Canvas[];
}

export interface UpdateCanvasResponse {
  canvas_id: string;
  room_info: RoomInfo;
}

export async function clearRoom(roomId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/clear`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ p_room_id: roomId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to clear room: ${response.statusText}`);
  }
}

export async function updateCanvasData(params: {
  roomId: string;
  canvasId?: string;
  imageSvg?: string;
  canvasData?: string;
}): Promise<UpdateCanvasResponse> {
  const response = await fetch(`${BASE_URL}/update_canva_data`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      p_room_id: params.roomId,
      p_canvas_id: params.canvasId,
      p_image_data_svg: params.imageSvg,
      p_canvas_data: params.canvasData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update canvas: ${response.statusText}`);
  }

  return response.json();
}

// Default room for testing
export const DEFAULT_ROOM_ID = '00000000-0000-0000-0000-000000000001';
