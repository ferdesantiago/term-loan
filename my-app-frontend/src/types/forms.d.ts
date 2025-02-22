declare global {
  interface BaseInputProps {
    name: string;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    onError?: (error: string) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    validation?: FormValidation;
    className?: string;
  }

  interface InputTextProps extends BaseInputProps {
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
    placeholder?: string;
    maxLength?: number;
    autoComplete?: string;
  }
}

export { };