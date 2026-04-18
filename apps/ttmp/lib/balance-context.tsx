'use client'

import { createAccountContext } from '@vlp/member-ui'
import { getTokenBalance, type BalanceData } from './api'

export const {
  Provider: BalanceProvider,
  useAccount: useBalance,
} = createAccountContext<BalanceData>(getTokenBalance)
