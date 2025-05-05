// constants/endPoints.js

// Base URL (client-side only)
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Common Path Prefixes
export const API = "/api";
export const V1 = "/v1";
export const API_V1_PREFIX = `${API}${V1}`;

// Full API base path
export const API_URL = `${BASE_URL}${API_V1_PREFIX}`;

// Final structured endpoint object
export const END_POINTS = {
  AUTH: {
    SIGN_UP: `${API_URL}/auth/signup`,
  },

  CREATOR: {
    UPLOAD_POST: `${API_URL}/creator/upload-post`,
  },

  MEDIA: {
    UPLOAD_POST: `${API_URL}/creator/upload-post`,
    FEED: `${API_URL}/media/feed`,
    LIKE: `${API_URL}/media/like`,
    SEARCH: `${API_URL}/media/search`,
    COMMENT: `${API_URL}/media/comment`,
  },
};
