// constants/endPoints.js

// Base URL (client-side only)
// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Common Path Prefixes
export const API = "/api";
export const V1 = "/v1";
export const API_V1_PREFIX = `${API}${V1}`;

// Full API base path
// export const API_URL = `${BASE_URL}${API_V1_PREFIX}`;

// Final structured endpoint object
export const END_POINTS = {
  AUTH: {
    SIGN_UP: `${API_V1_PREFIX}/auth/signup`,
  },

  CREATOR: {
    UPLOAD_POST: `${API_V1_PREFIX}/creator/upload-post`,
  },

  MEDIA: {
    UPLOAD_POST: `${API_V1_PREFIX}/creator/upload-post`,
    FEED: `${API_V1_PREFIX}/media/feed`,
    LIKE: `${API_V1_PREFIX}/media/like`,
    SEARCH: `${API_V1_PREFIX}/media/search`,
    COMMENT: `${API_V1_PREFIX}/media/comment`,
  },
};
