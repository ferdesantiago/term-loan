import axios from 'axios';
import moment from 'moment';
import { ICalculate, ICalculateResponse, IFredResponse } from '../interfaces/calculate';

async function getPrimeInterestRate(substractDays: number): Promise<number> {
    try {
        const actualDate = moment().subtract(substractDays, 'days').format('YYYY-MM-DD');
        const response = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=DPRIME&file_type=json&api_key=5eefe51556ce98dfb2cf6f70b24afcbf&observation_start=${actualDate}&observation_end=9999-12-31`);
        const fred = response.data as IFredResponse;
        return +fred.observations[fred.observations.length - 1]?.value;
    } catch (error) {
        throw new Error(`FRED unexpected Error: ${error}`);
    }
}

function roundNumber(number: number): number {
    return Math.floor(number * 100) / 100;
}

function calculateDailyInterestAccrued(loanAmount: number, totalPrincipalLoanPayment: number, dailyInterestRate: number): number {
    const outstandingLoadBalance = loanAmount - totalPrincipalLoanPayment;
    return outstandingLoadBalance * dailyInterestRate;
}

export async function calculateAmortizationSchedule(data: ICalculate): Promise<ICalculateResponse[]> {
    try {
        const primeInterestRate = await getPrimeInterestRate(3);
        const dailyInterestRate = (primeInterestRate + data.marginAbovePrime) / 360;
        const monthlyPrincipalPayment = (data.loanAmount / data.amortization);
        let totalPrincipalLoanPayment = 0;
        let loanBalance = data.loanAmount;
        let lastDate = moment();

        const response = [];
        for (let i=0; i<data.amortization; i++) {
            totalPrincipalLoanPayment += monthlyPrincipalPayment;
            lastDate = lastDate.add(1, 'M').endOf('month');
            let item;
            if (i < data.terms) {
                item = {
                    date: lastDate.format('YYYY-MM-DD'),
                    startingBalance: roundNumber(loanBalance),
                    interestPayment: roundNumber(calculateDailyInterestAccrued(data.loanAmount, totalPrincipalLoanPayment, dailyInterestRate)),
                    principalPayment: roundNumber(monthlyPrincipalPayment),
                    endingBalance: roundNumber(loanBalance - monthlyPrincipalPayment)
                };
                loanBalance -= monthlyPrincipalPayment;
            } else if (i === data.terms) {
                item = {
                    date: lastDate.format('YYYY-MM-DD'),
                    startingBalance: roundNumber(loanBalance),
                    interestPayment: roundNumber(calculateDailyInterestAccrued(data.loanAmount, totalPrincipalLoanPayment, dailyInterestRate)),
                    principalPayment: roundNumber(loanBalance),
                    endingBalance: 0
                };
            } else {
                item = {
                    date: lastDate.format('YYYY-MM-DD'),
                    startingBalance: 0,
                    interestPayment: 0,
                    principalPayment: 0,
                    endingBalance: 0
                };
            }
            response.push(item);
        }
        return response;
    } catch (error) {
        throw new Error(`Unexpected Error: ${error}`);
    }
}
