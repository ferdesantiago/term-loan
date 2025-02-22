declare global {
    interface AmortizationPayment {
        date: string;
        startingBalance: number;
        interestPayment: number;
        principalPayment: number;
        endingBalance: number;
    }

    interface AmortizationSchedule {
        data: AmortizationPayment[];
    }
}

export { };