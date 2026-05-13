export const API_BASE = 'https://api.virtuallaunch.pro';

async function jsonFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') window.location.href = '/sign-in';
    throw new Error('unauthorized');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export type Script = {
  script_id: string;
  account_id: string;
  title?: string;
  topic?: string;
  hook?: string;
  body?: string;
  script?: string;
  status?: 'pending' | 'approved' | 'rendering' | 'rendered' | 'published' | string;
  approved?: boolean;
  created_at?: string;
};

export type Render = {
  render_id: string;
  account_id: string;
  script_id?: string;
  script_title?: string;
  avatar_name?: string;
  status?: 'processing' | 'completed' | 'failed' | 'published' | string;
  video_url?: string;
  youtube_url?: string;
  youtube_video_id?: string;
  error?: string;
  created_at?: string;
  thumbnail_url?: string;
};

export type AvatarLook = {
  look_id: string;
  name: string;
  preview_image_url: string | null;
  gender: string | null;
};

export type Avatar = {
  name: string;
  display_name?: string;
  heygen_name?: string;
  avatar_id: string;
  looks_count: number;
  default_voice_id: string | null;
  looks: AvatarLook[];
};

export type CustomAvatar = {
  group_id: string;
  talking_photo_id: string;
  training_status: 'pending' | 'training' | 'ready' | 'failed' | string;
  gender: 'male' | 'female' | string;
  created_at?: string;
};

export type Channel = {
  account_id: string;
  channel_id?: string;
  channel_url?: string;
  channel_name?: string;
  channel_handle?: string;
  topic?: string;
  selected_avatar?: string;
  avatar_preference?: string;
  custom_avatar?: CustomAvatar;
  subscriber_count?: number;
  view_count?: number;
  video_count?: number;
  updated_at?: string;
};

export const tavlpApi = {
  listScripts: (accountId: string): Promise<{ ok: boolean; scripts: Script[] }> =>
    jsonFetch(`/v1/tavlp/scripts/${encodeURIComponent(accountId)}`),
  generateScripts: (body: { account_id: string; topic: string; count: number }) =>
    jsonFetch(`/v1/tavlp/scripts/generate`, { method: 'POST', body: JSON.stringify(body) }),
  approveScript: (scriptId: string) =>
    jsonFetch(`/v1/tavlp/scripts/${encodeURIComponent(scriptId)}/approve`, { method: 'POST', body: '{}' }),
  listRenders: (accountId: string): Promise<{ ok: boolean; renders: Render[] }> =>
    jsonFetch(`/v1/tavlp/renders/${encodeURIComponent(accountId)}`),
  renderStatus: (renderId: string) =>
    jsonFetch(`/v1/tavlp/render/${encodeURIComponent(renderId)}/status`),
  listAvatars: (): Promise<{ ok: boolean; avatars: Avatar[]; updated_at?: string }> =>
    jsonFetch(`/v1/tavlp/avatars`),
  getChannel: (accountId: string): Promise<{ ok: boolean; channel?: Channel }> =>
    jsonFetch(`/v1/tavlp/channels/${encodeURIComponent(accountId)}`),
  setChannel: (accountId: string, channel: Partial<Channel>) =>
    jsonFetch(`/v1/tavlp/channels/${encodeURIComponent(accountId)}`, { method: 'PUT', body: JSON.stringify(channel) }),
  getCustomAvatarStatus: (accountId: string): Promise<{ ok: boolean; custom_avatar: CustomAvatar | null }> =>
    jsonFetch(`/v1/tavlp/avatar/status/${encodeURIComponent(accountId)}`),
  uploadCustomAvatar: async (
    accountId: string,
    photo: File,
    gender: 'male' | 'female',
  ): Promise<{ ok: boolean; group_id: string; talking_photo_id: string; training_status: string; message?: string }> => {
    const fd = new FormData();
    fd.append('photo', photo);
    fd.append('account_id', accountId);
    fd.append('gender', gender);
    const res = await fetch(`${API_BASE}/v1/tavlp/avatar/upload`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    if (res.status === 401) {
      if (typeof window !== 'undefined') window.location.href = '/sign-in';
      throw new Error('unauthorized');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || `Upload failed (${res.status})`);
    return data;
  },
};
