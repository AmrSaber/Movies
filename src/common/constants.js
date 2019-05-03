// services types
const SERVICE_TYPE_BOOKING = '@service-type/booking';
const SERVICE_TYPE_YTS = '@service-type/yts';
const SERVICES = [SERVICE_TYPE_BOOKING, SERVICE_TYPE_YTS];
const servicesMap = {
    [SERVICE_TYPE_BOOKING]: 'Booking',
    [SERVICE_TYPE_YTS]: 'YTS',
}

// application actions
const ACTION_UNSUBSCRIBE = '@actions/unsubscribe';
const ACTIONS = [ACTION_UNSUBSCRIBE];

// base url for APIs
const BASE_API_URL = '/api';

module.exports = {
    SERVICE_TYPE_BOOKING,
    SERVICE_TYPE_YTS,
    SERVICES,
    servicesMap,
    ACTION_UNSUBSCRIBE,
    ACTIONS,
    BASE_API_URL,
}