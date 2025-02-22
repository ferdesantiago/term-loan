import express from 'express';
import { calculateAmortizationSchedule } from './services/calculate';
import { CustomError } from './classes/customError';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 5000;

app.post('/api/calculate', async (req, res) => {
    try {
        const { loanAmount, amortization, terms, marginAbovePrime } = req.body;
        if (!loanAmount || isNaN(loanAmount) || loanAmount < 0) throw new CustomError(`Loan amount must be a positive number, received: ${loanAmount}`, 400);
        if (!amortization || isNaN(amortization) || amortization <= 0) throw new CustomError(`Amotization months must be a positive number above 0, received: ${amortization}`, 400);
        if (!terms || isNaN(terms) || terms <= 0 && terms > amortization) throw new CustomError(`Term amount must be a positive number above 0 and lesser than Amotization months, received: ${terms}`, 400);
        if (!marginAbovePrime || isNaN(marginAbovePrime) || marginAbovePrime < 0) throw new CustomError(`Margin above prime interest rate must be a positive number, received: ${marginAbovePrime}`, 400);

        const schedule = await calculateAmortizationSchedule({ loanAmount, amortization, terms, marginAbovePrime })
        res.json({ data: schedule }).status(201);
    } catch (error: any) {
        res.json({ msg: error?.message }).status(error?.status);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
