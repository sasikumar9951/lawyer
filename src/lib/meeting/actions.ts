"use server";

import { createMeeting, validateMeetingOptions } from "./meeting-service";
import {
  GenerateMeetingLinkRequest,
  GenerateMeetingLinkResponse,
  CreateMeetingOptions
} from "@/types/api/meetings";

/**
 * Server action to generate a meeting link
 */
export const generateMeetingLink = async (
  options: GenerateMeetingLinkRequest
): Promise<GenerateMeetingLinkResponse> => {
  try {
    // Validate the input options
    const validatedOptions: CreateMeetingOptions = validateMeetingOptions({
      startTime: options.startTime,
      endTime: options.endTime,
      duration: options.duration,
      timezone: options.timezone || "Asia/Kolkata",
      meetingName: options.meetingName,
    });

    // Generate the meeting link
    const meetingLink = await createMeeting(validatedOptions);

    return {
      success: true,
      data: {
        link: meetingLink,
      },
      message: "Meeting link generated successfully",
    };
  } catch (error) {
    console.error("Error generating meeting link:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate meeting link",
    };
  }
};
