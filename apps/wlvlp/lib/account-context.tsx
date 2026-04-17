'use client';

import { createAccountContext } from '@vlp/member-ui';
import { getBuyerDashboard } from './api';
import type { BuyerDashboard } from './api';

export const {
  Provider: BuyerProvider,
  useAccount: useBuyer,
} = createAccountContext<BuyerDashboard>(getBuyerDashboard);
