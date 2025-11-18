export interface CreateMeetingOptions {
  startTime: string; // ISO string
  endTime: string; // ISO string
  duration: number; // in minutes
  timezone?: string; // defaults to 'Asia/Kolkata'
  meetingName?: string;
}

export interface DailyCoMeetingResponse {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: {
    start_video_off: boolean;
    start_audio_off: boolean;
    exp: number;
    nbf?: number;
    eject_after_elapsed?: number;
  };
}

export interface DailyCoCreateMeetingRequest {
  name?: string;
  privacy: "public" | "org" | "private";
  properties?: {
    start_video_off?: boolean;
    start_audio_off?: boolean;
    exp?: number;
    nbf?: number;
    eject_after_elapsed?: number; // seconds
    max_participants?: number;
    enable_chat?: boolean;
    enable_recording?: string;
  };
}

export interface GenerateMeetingLinkRequest {
  startTime: string;
  endTime: string;
  duration: number;
  timezone?: string;
  meetingName?: string;
}

export interface GenerateMeetingLinkResponse {
  success: boolean;
  data?: {
    link: string;
  };
  message?: string;
}
