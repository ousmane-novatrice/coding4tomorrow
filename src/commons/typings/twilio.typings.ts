export interface TwilioMessageAccepted {
  account_id: string;
  api_version: string;
  body: string;
  date_created: string;
  date_sent: string;
  date_updated: string;
  direction: string;
  error_code: number;
  error_message: string;
  from: string;
  messaging_service_sid: string;
  num_media: string;
  num_segments: string;
  price: string;
  price_unit: string;
  sid: string;
  status: string;
  subresource_uris: {
    media: string;
  };
  to: string;
  uri: string;
}

export interface TwilioMessageNotDeliveredError extends Error {
  status: number;
  message: string;
  code: number;
  moreInfo: string;
  defail: string;
}
