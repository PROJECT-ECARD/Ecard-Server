export class PaymentRevertCompletedEvent {
    constructor(
      public readonly paymentId: string,
    ) {}
  }