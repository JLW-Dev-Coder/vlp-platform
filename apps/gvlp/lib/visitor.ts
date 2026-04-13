import { v4 as uuidv4 } from 'uuid';

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('gvlp_visitor_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('gvlp_visitor_id', id);
  }
  return id;
}

export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('client_id');
  if (fromUrl) {
    localStorage.setItem('gvlp_client_id', fromUrl);
    return fromUrl;
  }
  return localStorage.getItem('gvlp_client_id') || '';
}
