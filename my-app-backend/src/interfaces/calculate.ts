export interface IFredResponse {
    realtime_start: string,
    realtime_end: string,
    observation_start: string,
    observation_end: string,
    units: string,
    output_type: number,
    file_type: string,
    order_by: string,
    sort_order: string,
    count: number,
    offset: number,
    limit: number,
    observations: IFredResponseItem[]
}

export interface IFredResponseItem {
    realtime_start: string,
    realtime_end: string,
    date: string,
    value: string
}

export interface ICalculate {
    loanAmount: number,
    amortization: number,
    terms: number,
    marginAbovePrime: number,
    startDate: string
}

export interface ICalculateResponse {
    date: string,
    startingBalance: number,
    interestPayment: number,
    principalPayment: number,
    endingBalance: number
}