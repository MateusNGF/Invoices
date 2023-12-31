export class Invoice {
  id?: string;
  numberInvoice: string;
  serieInvoice: string;
  numberClient: string;
  competency: Date;
  energyElectrical: Invoice.ContentInfo;
  energySCEE: Invoice.ContentInfo;
  energyCompensated: Invoice.ContentInfo;
  municipalContribution: number;
  totalPrice: number;
  fileName?: string;
  createdAt?: Date;
}

export namespace Invoice {
  export interface ContentInfo {
    quantity: number;
    price: number;
    unit: string;
  }
}
