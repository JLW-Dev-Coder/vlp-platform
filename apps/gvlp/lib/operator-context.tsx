'use client';

import { createAccountContext } from '@vlp/member-ui';
import { getOperator } from './api';
import type { Operator } from './api';

export const {
  Provider: OperatorProvider,
  useAccount: useOperator,
} = createAccountContext<Operator>(getOperator);
