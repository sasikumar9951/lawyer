export type SendWhatsAppResponse =
  | {
      success: true;
      data: { sid: string; status: string | null };
    }
  | {
      success: false;
      message: string;
    };
