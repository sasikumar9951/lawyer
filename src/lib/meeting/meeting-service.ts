import {
  CreateMeetingOptions,
  DailyCoCreateMeetingRequest,
  DailyCoMeetingResponse,
} from "@/types/api/meetings";

const DAILY_CO_API_KEY = process.env.MEETING_API_KEY;
const DAILY_CO_BASE_URL = "https://api.daily.co/v1";

/**
 * Creates a meeting room using the configured meeting service
 * Currently uses Daily.co, but can be easily switched to other providers
 * Prioritizes duration over end time if there's a conflict
 */
export const createMeeting = async (
  options: CreateMeetingOptions
): Promise<string> => {
  try {
    const {
      startTime,
      endTime,
      duration,
      timezone = "Asia/Kolkata",
      meetingName,
    } = options;

    // Convert times to Indian timezone
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Calculate actual end time based on duration (prioritize duration)
    const actualEndDate = new Date(startDate.getTime() + duration * 60 * 1000);

    // Use the earlier of calculated end time or provided end time
    const finalEndDate = actualEndDate < endDate ? actualEndDate : endDate;

    // Daily.co expects Unix timestamp in seconds for nbf (not-before) and exp (expires)
    // Set nbf to the scheduled start and exp to the scheduled end to auto-close at end time
    const notBeforeTime = Math.floor(startDate.getTime() / 1000);
    const expirationTime = Math.floor(finalEndDate.getTime() / 1000);
    const ejectAfterElapsedSeconds = duration * 60;

    const meetingRequest: DailyCoCreateMeetingRequest = {
      name: meetingName || `Meeting-${Date.now()}`,
      privacy: "public",
      properties: {
        start_video_off: true,
        start_audio_off: true,
        nbf: notBeforeTime,
        exp: expirationTime,
        eject_after_elapsed: ejectAfterElapsedSeconds,
      },
    };

    console.log("Daily.co API Request:", {
      url: `${DAILY_CO_BASE_URL}/rooms`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_CO_API_KEY?.substring(0, 10)}...`,
      },
      body: meetingRequest,
    });

    const response = await fetch(`${DAILY_CO_BASE_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_CO_API_KEY}`,
      },
      body: JSON.stringify(meetingRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Daily.co API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        `Meeting service error: ${errorData.error || response.statusText}`
      );
    }

    const meetingData: DailyCoMeetingResponse = await response.json();
    return meetingData.url;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw new Error(
      `Failed to create meeting: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Validates meeting options and returns sanitized data
 */
export const validateMeetingOptions = (
  options: CreateMeetingOptions
): CreateMeetingOptions => {
  const {
    startTime,
    endTime,
    duration,
    timezone = "Asia/Kolkata",
    meetingName,
  } = options;

  if (!startTime || !endTime || !duration) {
    throw new Error("Start time, end time, and duration are required");
  }

  if (duration <= 0) {
    throw new Error("Duration must be greater than 0");
  }

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  if (startDate >= endDate) {
    throw new Error("Start time must be before end time");
  }

  return {
    startTime,
    endTime,
    duration,
    timezone,
    meetingName,
  };
};
