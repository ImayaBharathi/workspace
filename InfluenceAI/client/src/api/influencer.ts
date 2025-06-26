import api from './api';

export interface InfluencerProfile {
  _id: string;
  email: string;
  influencerProfile: {
    name: string;
    bio: string;
    niche: string;
    followerCount: number;
    location: string;
    rates: {
      sponsoredPost: number;
      storyPost: number;
      reelPost: number;
      productReview: number;
      longTermPartnership: number;
    };
    instagramHandle: string;
    isProfileComplete: boolean;
  };
}

export interface CreateInfluencerProfileData {
  name?: string;
  bio?: string;
  niche: string;
  followerCount?: number;
  location?: string;
  rates?: {
    sponsoredPost?: number;
    storyPost?: number;
    reelPost?: number;
    productReview?: number;
    longTermPartnership?: number;
  };
  instagramHandle?: string;
}

// Description: Create or update influencer profile
// Endpoint: POST /api/influencer/profile
// Request: CreateInfluencerProfileData
// Response: { success: boolean, message: string, data: InfluencerProfile }
export const createOrUpdateInfluencerProfile = async (data: CreateInfluencerProfileData) => {
  try {
    const response = await api.post('/api/influencer/profile', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get current user's influencer profile
// Endpoint: GET /api/influencer/profile
// Request: {}
// Response: { success: boolean, data: InfluencerProfile }
export const getInfluencerProfile = async () => {
  try {
    const response = await api.get('/api/influencer/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get influencer profile by ID
// Endpoint: GET /api/influencer/profile/:id
// Request: { id: string }
// Response: { success: boolean, data: InfluencerProfile }
export const getInfluencerProfileById = async (id: string) => {
  try {
    const response = await api.get(`/api/influencer/profile/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all influencer profiles
// Endpoint: GET /api/influencer/profiles
// Request: {}
// Response: { success: boolean, data: InfluencerProfile[] }
export const getAllInfluencerProfiles = async () => {
  try {
    const response = await api.get('/api/influencer/profiles');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};