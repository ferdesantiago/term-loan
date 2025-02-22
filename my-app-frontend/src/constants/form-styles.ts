export const FORM_STYLES = {
  container: 'w-full',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: {
    base: 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed',
    default: 'border-gray-300 focus:ring-primary-200 focus:border-primary-500',
    error: 'border-red-500 focus:ring-red-200',
    success: 'border-green-500 focus:ring-green-200'
  },
  errorText: 'mt-1 text-sm text-red-500',
  helperText: 'mt-1 text-sm text-gray-500',
  required: 'text-red-500 ml-1'
} as const;