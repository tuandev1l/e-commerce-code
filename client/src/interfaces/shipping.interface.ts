export interface IShipping {
  id: string;
  partnerId: string;
  partnerName: string;
  trackingCode?: string;
  status: string;
  plan: IShippingPlan;
}
