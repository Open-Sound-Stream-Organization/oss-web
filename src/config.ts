export const DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

//const BASE_URL = DEV ? 'https://de0.win' : '';
const BASE_URL = '';
export const API_URL = `${BASE_URL}/api/v1`;