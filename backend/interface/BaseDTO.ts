export interface BaseRequest {
  // Add common request properties here if needed (e.g. traceId)
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}
