import classNames from 'classnames';
import type { ReactNode } from 'react';
import PageTitle from '../components/PageTitle';
import Button from '../components/Button';
import { format } from '../utils/date';
import useSubscription from '../hooks/api/useSubscription';
import PageLoading from '../components/PageLoading';
import useCreateCustomerPortalSession from '../hooks/api/useCreateCustomerProtalSession';
import Icon from '../components/Icon';

export default function BillingPage() {
  const { data: subscription, isLoading } = useSubscription();
  const { status, plan_name, price, expires_at, store } = subscription;
  const { isLoading: isCreatingSession, run: createCustomerPortalSession } =
    useCreateCustomerPortalSession();

  const isPro = plan_name === 'Pro';
  const isStripe = store === 'stripe';
  const trialEndDate = expires_at ? new Date(expires_at) : null;
  const isTrialing = status === 'trialing' && trialEndDate;

  if (isLoading) return <PageLoading />;

  const action =
    isStripe && isPro ? (
      <Button
        variant="accent"
        color="gray"
        size="sm"
        onClick={() => createCustomerPortalSession()}
        loading={isCreatingSession}
      >
        Manage subscription
      </Button>
    ) : !isPro ? (
      <Button
        size="sm"
        onClick={() => createCustomerPortalSession()}
        loading={isCreatingSession}
      >
        Upgrade to Pro
      </Button>
    ) : null;

  // A summary card for the plan (its name and action, then its price and
  // status as label/value pairs), then a card of what it includes, in two
  // columns.
  return (
    <div className="max-w-3xl mx-auto font-plain text-on-surface">
      <PageTitle title="Billing" />
      {/* PageTitle pads its text 8px: the rest lines up with it. */}
      <div className="flex flex-col gap-8 px-2">
        <section className="rounded-extra-large-increased bg-surface-container-low">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <div className="text-label-large text-on-surface-variant">
                Current plan
              </div>
              <h2 className="text-headline-small-emphasized">{plan_name}</h2>
            </div>
            {action}
          </div>
          <dl className="grid grid-cols-2 gap-4 px-6 py-5 border-t border-outline-variant sm:grid-cols-3">
            <Detail label="Price">
              {
                // `?? 0`: no price is free, as `undefined > 0` was false.
                (price ?? 0) > 0 ? (
                  <>
                    <span className="text-title-large">$20.00</span>
                    <span className="text-on-surface-variant"> / month</span>
                  </>
                ) : (
                  <span className="text-title-large">Free</span>
                )
              }
            </Detail>
            <Detail label="Status">
              <StatusPill status={status} />
            </Detail>
            {isTrialing && (
              <Detail label="Trial ends">
                {format(trialEndDate, 'MMM D')}
              </Detail>
            )}
          </dl>
        </section>

        <section className="p-6 rounded-extra-large-increased bg-surface-container-low">
          <h2 className="mb-4 text-title-medium">What&rsquo;s included</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 text-body-large">
            {INCLUDED.map(feature => (
              <Feature key={feature} included>
                {feature}
              </Feature>
            ))}
            {PRO_ONLY.map(feature => (
              <Feature key={feature} included={isPro}>
                {feature}
              </Feature>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

const INCLUDED = [
  'Unlimited songs, folders and sets',
  'Unlimited teams',
  'Permissions and access control',
  'Metronome',
  'Autoscroll',
];

const PRO_ONLY = [
  'Sessions',
  'Sticky notes',
  'File management',
  'Spotify, Apple Music and YouTube tracks',
];

/** Active on primary-container, Trial on tertiary-container, or any other
    status (past due, canceled…) as is on error-container, with a dot. */
function StatusPill({ status }: { status?: string | null }) {
  const label =
    status === 'active'
      ? 'Active'
      : status === 'trialing'
        ? 'Trial'
        : capitalize((status ?? 'unknown').replace(/_/g, ' '));

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-2 h-7 px-3 rounded-full text-label-large',
        status === 'active'
          ? 'bg-primary-container text-on-primary-container'
          : status === 'trialing'
            ? 'bg-tertiary-container text-on-tertiary-container'
            : 'bg-error-container text-on-error-container'
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-label-medium text-on-surface-variant">{label}</dt>
      <dd className="text-body-large">{children}</dd>
    </div>
  );
}

/** A feature: a check when the plan has it, or muted with a Pro label. */
function Feature({
  included,
  children,
}: {
  included: boolean;
  children: ReactNode;
}) {
  return (
    <li
      className={classNames(
        'flex items-start gap-3',
        !included && 'text-on-surface-variant'
      )}
    >
      <Icon
        name={included ? 'check' : 'remove'}
        className={classNames(
          'w-6 h-6 shrink-0',
          included ? 'text-primary' : 'text-on-surface-variant'
        )}
      />
      <span>
        {children}
        {!included && (
          <span className="inline-flex items-center h-5 px-2 ml-2 align-middle rounded-full bg-surface-container-highest text-label-small">
            Pro
          </span>
        )}
      </span>
    </li>
  );
}
