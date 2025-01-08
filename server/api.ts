import { toast } from 'react-toastify'

import { generateErrorMessages } from '@/lib/helper';

import { TextConstants } from '@/constant/text';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

// Define a type for the fetch options
type FetchApiOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

/**
 * Custom Fetch API wrapper with TypeScript support
 * @param {string} endpoint - The API endpoint (relative to BASE_URL)
 * @param {FetchApiOptions} options - Additional fetch options
 * @returns {Promise<T>} - The response from the API
 */
export const fetchApi = async <T>(
  endpoint: string,
  options: FetchApiOptions = {},
  showSuccessToast?: boolean
) => {
  const defaultHeaders: Record<string, string> = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // Allow custom headers to override defaults
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      
      toast.error(
        errorData.error || generateErrorMessages(errorData)[0] || TextConstants.errors.generic_error_message
      );
      // throw new Error(errorData.error || `API Error: ${response.status}`);
      return;
    }

    showSuccessToast && toast.success(TextConstants.success.payment_success)
    return response.json(); // Assuming the API returns JSON
  } catch (error) {
    toast.error('Fetch API Error')
    // console.error('Fetch API Error:', error);
    // throw error;
  }
};
