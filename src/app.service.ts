import { Injectable } from '@nestjs/common';
import { FinMaster } from 'finmaster';

@Injectable()
export class AppService {
  getHello(): any {
    let finmaster = new FinMaster();
    let pv = this.calculatePV(
      0.0889 / 12,
      12000,
      -250000000000000000000000000000000,
      0,
      0,
    );
    console.log(pv);
    return pv;
  }


  calculatePV(rate, nper, pmt, fv = 0, type = 0) {
    let pv = 0;

    // Calculate discount factor
    let discountFactor = Math.pow(1 + rate, -nper);

    // Calculate present value of payments
    for (let i = 1; i <= nper; i++) {
        pv += pmt / Math.pow(1 + rate, i);
    }

    // Add present value of future cash flow
    pv += fv * discountFactor;

    // Adjust for payment timing
    if (type === 1) {
        pv *= (1 + rate);
    }

    return pv;
}

}
