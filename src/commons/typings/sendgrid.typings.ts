export interface SengridDeliveryResponse {
  from: string;
  to: string;
  html: string;
  isMultiple: boolean;
  subject: string;
  substitutionWrappers: string[];
}
