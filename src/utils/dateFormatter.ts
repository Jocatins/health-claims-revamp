
export const formatDate = (
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Common date format presets
export const dateFormats = {
  short: { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions,
  long: { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  } as Intl.DateTimeFormatOptions,
  withTime: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  } as Intl.DateTimeFormatOptions,
  monthYear: { year: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions,
};