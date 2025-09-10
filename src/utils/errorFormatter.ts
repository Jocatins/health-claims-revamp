
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatApiError = (error: any): string => {
  if (!error) {
    return 'Something went wrong, please try again later';
  }

  if (error.response?.data) {
    const response = error.response.data;
    return cleanErrorMessage(extractValidationErrors(response.errors || response.title || response.message));
  }

  if (error.message) {
    return cleanErrorMessage(error.message);
  }

  return 'No response from server, check your network connectivity.';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractValidationErrors = (data: any): string => {
  if (!data) return 'Unknown error occurred';

  if (typeof data === 'string') return data;

  if (Array.isArray(data)) {
    return data.join(', ');
  }

  if (typeof data === 'object') {
    if (data.errors) {
      const errors = data.errors;
      if (typeof errors === 'object') {
        return Object.entries(errors)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            }
            return `${field}: ${messages}`;
          })
          .join('\n');
      }
      return String(errors);
    }
    return JSON.stringify(data);
  }

  return String(data);
};

const cleanErrorMessage = (value: string): string => {
  if (value.toLowerCase().includes('internal server error')) {
    return 'No response from the server, check your network connectivity.';
  }
//   if (value.includes('https://tools.ietf.org') || value.includes('html')) {
//     return 'Something went wrong, please try again later.';
//   }
  return value;
};