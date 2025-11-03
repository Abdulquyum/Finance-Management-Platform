class VatService {
  constructor() {
    this.vatRates = {
      'standard': 0.20, // 20% standard VAT rate
      'reduced': 0.05,  // 5% reduced rate
      'zero': 0.00      // 0% zero rate
    };
  }

  calculateVAT(amount, vatRateType = 'standard') {
    const vatRate = this.vatRates[vatRateType] || 0.20;
    const vatAmount = amount * vatRate;
    const totalAmount = amount + vatAmount;

    return {
      netAmount: amount,
      vatRate: vatRate * 100, // Return as percentage
      vatAmount: parseFloat(vatAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      vatRateType
    };
  }

  recalculateVATForPaidInvoices(paidInvoices) {
    let totalVAT = 0;
    let totalRevenue = 0;

    paidInvoices.forEach(invoice => {
      totalVAT += invoice.vatAmount || 0;
      totalRevenue += invoice.netAmount || 0;
    });

    return {
      totalVAT: parseFloat(totalVAT.toFixed(2)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      grandTotal: parseFloat((totalRevenue + totalVAT).toFixed(2))
    };
  }
}

module.exports = new VatService();
