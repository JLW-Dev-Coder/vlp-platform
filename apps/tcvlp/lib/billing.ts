import { tcvlpConfig } from './platform-config';

export class BillingPortalError extends Error {}

export async function openBillingPortal(args: {
  accountId: string;
  customerId: string;
  returnUrl: string;
}): Promise<void> {
  if (!args.customerId) {
    throw new BillingPortalError(
      'No billing account found. Please complete setup first.'
    );
  }

  const eventId = crypto.randomUUID();
  const res = await fetch(
    `${tcvlpConfig.apiBaseUrl}/v1/billing/portal/sessions`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: args.accountId,
        customerId: args.customerId,
        eventId,
        returnUrl: args.returnUrl,
      }),
    }
  );

  if (!res.ok) {
    throw new BillingPortalError(`Portal session failed (${res.status})`);
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new BillingPortalError('No portal URL in response');
  }

  window.location.assign(data.url);
}
