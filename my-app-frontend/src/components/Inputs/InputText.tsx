import React, { useState } from "react";
import { FORM_STYLES } from "../../constants/form-styles";

const InputText: React.FC<InputTextProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  onError,
  placeholder = "",
  required = false,
  error,
  disabled = false,
  type = "text",
  validation,
  className = "",
  maxLength,
  autoComplete
}) => {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string>("");

  const validateField = (fieldValue: any): string => {
    if (!validation) return "";

    if (validation.required) {
      const isRequired = typeof validation.required === "boolean" 
        ? validation.required 
        : validation.required.value;

      if (isRequired && !fieldValue) {
        return typeof validation.required === "boolean"
          ? "This field is required"
          : validation.required.message;
      }
    }

    if (validation.pattern && !RegExp(validation.pattern.value).test(fieldValue)) {
      return validation.pattern.message;
    }

    if (validation.minLength && fieldValue.length < validation.minLength.value) {
      return validation.minLength.message;
    }

    if (validation.maxLength && fieldValue.length > validation.maxLength.value) {
      return validation.maxLength.message;
    }

    if (type === 'number' && validation.min && Number(fieldValue) < validation.min.value) {
      return validation.min.message;
    }

    if (type === 'number' && validation.max && Number(fieldValue) > validation.max.value) {
      return validation.max.message;
    }

    if (validation.validate) {
      const result = validation.validate(fieldValue);
      if (typeof result === 'string') return result;
      if (!result) return "Invalid field";
    }

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (touched) {
      const validationError = validateField(newValue);
      setLocalError(validationError);
    }
  };

const handleBlur = () => {
    setTouched(true);
    const validationError = validateField(value);
    setLocalError(validationError);
    onError?.(validationError);
    onBlur?.();
};

  const displayError = error || localError;

  return (
    <div className={`${FORM_STYLES.container} ${className}`}>
      {label && (
        <label htmlFor={name} className={FORM_STYLES.label}>
          {label}
          {required && <span className={FORM_STYLES.required}>*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`
            ${FORM_STYLES.input.base}
            ${displayError && touched 
              ? FORM_STYLES.input.error 
              : FORM_STYLES.input.default}
          `}
        />
        {displayError && touched && (
          <p className={FORM_STYLES.errorText}>
            {displayError}
          </p>
        )}
      </div>
    </div>
  );
};

export default InputText;