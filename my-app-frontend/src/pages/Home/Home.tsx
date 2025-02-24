import React, { useState, useEffect } from 'react';
import InputText from '../../components/Inputs/InputText';
import AmortizationTable from '../../components/AmortizationTable/AmortizationTable';

const Home: React.FC = () => {
    const [formData, setFormData] = useState({
        loanAmount: '',
        amortization: '',
        terms: '',
        marginAbovePrime: '',
        startDate: ''
    });

    const [errors, setErrors] = useState({
        loanAmount: '',
        amortization: '',
        terms: '',
        marginAbovePrime: ''
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationSchedule | null>(null);
    const [apiError, setApiError] = useState<string>('');

    const validateForm = () => {
        const hasValues = Object.values(formData).every(value => value !== '');
        const hasNoErrors = Object.values(errors).every(error => !error);
        setIsFormValid(hasValues && hasNoErrors);
    };

    useEffect(() => {
        validateForm();
    }, [formData, errors]);

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleError = (field: string) => (error: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const handleSubmit = async () => {
        if (isFormValid) {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/calculate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        loanAmount: parseFloat(formData.loanAmount),
                        amortization: parseFloat(formData.amortization),
                        terms: parseFloat(formData.terms),
                        marginAbovePrime: parseFloat(formData.marginAbovePrime),
                        startDate: formData.startDate
                    })
                });
    
                const result = await response.json();
                setAmortizationSchedule(result);
            } catch (error: any) {
                setApiError(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Loan Calculator</h1>

                <div className="space-y-4">
                    <InputText
                        label="Principal loan amount (USD)"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleInputChange('loanAmount')}
                        onError={handleError('loanAmount')}
                        type="number"
                        placeholder="Enter loan amount"
                        required
                        validation={{
                            required: {
                                value: true,
                                message: "Principal amount is required"
                            },
                            min: {
                                value: 0,
                                message: "Amount must be 0 or greater"
                            }
                        }}
                    />

                    <InputText
                        label="Amortization months"
                        name="amortization"
                        value={formData.amortization}
                        onChange={handleInputChange('amortization')}
                        onError={handleError('amortization')}
                        type="number"
                        placeholder="Enter number of months"
                        required
                        validation={{
                            required: {
                                value: true,
                                message: "Amortization period is required"
                            },
                            min: {
                                value: formData.terms,
                                message: "Period must be greater than terms"
                            }
                        }}
                    />

                    <InputText
                        label="Term (months)"
                        name="terms"
                        value={formData.terms}
                        onChange={handleInputChange('terms')}
                        onError={handleError('terms')}
                        type="number"
                        placeholder="Enter terms length"
                        required
                        validation={{
                            required: {
                                value: true,
                                message: "Term is required"
                            },
                            min: {
                                value: 1,
                                message: "Term must be greater than 0"
                            },
                            validate: (value: string) => {
                                const terms = Number(value);
                                const amortization = Number(formData.amortization);
                                return !amortization || terms <= amortization ||
                                    "Term must be less than the amortization period";
                            }
                        }}
                    />

                    <InputText
                        label="Margin above prime interest rate (%)"
                        name="marginAbovePrime"
                        value={formData.marginAbovePrime}
                        onChange={handleInputChange('marginAbovePrime')}
                        onError={handleError('marginAbovePrime')}
                        type="number"
                        placeholder="Enter margin rate"
                        required
                        validation={{
                            required: {
                                value: true,
                                message: "Margin rate is required"
                            },
                            min: {
                                value: 0,
                                message: "Margin rate must be 0 or greater"
                            }
                        }}
                    />

                    <InputText
                        label="Initial date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange('startDate')}
                        onError={handleError('startDate')}
                        type="date"
                        placeholder="Enter a date"
                        required
                        validation={{
                            required: {
                                value: true,
                                message: "a Date is required"
                            }
                        }}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                        className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors
                            ${isFormValid
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {isLoading ? (
                            <span>Calculating...</span>
                        ) : (
                            <span>Calculate Loan</span>
                        )}
                    </button>
                    {apiError && (
                        <div className="text-red-500 text-sm mt-2">{apiError}</div>
                    )}
                </div>
            </div>
            {amortizationSchedule && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Amortization Schedule
                    </h2>
                    <AmortizationTable schedule={amortizationSchedule} />
                </div>
            )}
        </div>
    );
};

export default Home;