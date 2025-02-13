export enum REQUEST_DAYS_OFF_API {
  REQUESTS = 'requests',
  REQUESTS_BY_ID = 'requests/%s',
  REQUEST_TYPES = 'request-types',

  REQUEST_OVERVIEW = 'requests/overview',
  REQUEST_RECEIVED = 'requests/received',
  REQUEST_TIME_OFF = 'request-time-offs',
  REQUEST_PREPARE = 'requests/prepare',
  REQUEST_PREPARE_BY_DEPARTMENT = 'requests/prepare/%s',

  REQUEST_CANCEL = 'requests/%s/cancel',
  REQUEST_APPROVE = 'requests/%s/approve',
  REQUEST_REJECT = 'requests/%s/reject',
}
