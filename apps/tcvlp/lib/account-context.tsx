'use client';

import { createAccountContext } from '@vlp/member-ui';
import {
  getTaxProByAccount,
  getSubscriptionStatusByAccount,
  type TaxPro,
  type SubscriptionStatus,
} from './api';

export const {
  Provider: TaxProProvider,
  useAccount: useTaxPro,
} = createAccountContext<TaxPro | null>(getTaxProByAccount);

export const {
  Provider: SubscriptionStatusProvider,
  useAccount: useSubscriptionStatus,
} = createAccountContext<SubscriptionStatus>(getSubscriptionStatusByAccount);
