export class PaymentCompletedEvent {
    constructor(
      public readonly paymentId: string,
    ) {}
  }