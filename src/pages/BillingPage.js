import React from 'react';
import PageTitle from '../components/PageTitle';
import Button from '../components/Button';
import Card from '../components/Card';
import CheckIcon from '@heroicons/react/outline/CheckIcon';
import XIcon from '@heroicons/react/outline/XIcon';
import Badge from '../components/Badge';
import { format } from '../utils/date';
import useSubscription from '../hooks/api/useSubscription';
import PageLoading from '../components/PageLoading';
import useCreateCustomerPortalSession from '../hooks/api/useCreateCustomerProtalSession';

export default function BillingPage() {
  const { data: subscription, isLoading } = useSubscription();
  const { status, plan_name, price, trial_end } = subscription;
  const { isLoading: isCreatingSession, run: createCustomerPortalSession } =
    useCreateCustomerPortalSession();

  const isPro = plan_name === 'Pro';
  const trialEndDate = trial_end ? new Date(trial_end * 1000) : null;
  const isTrialing = status === 'trialing' && trialEndDate;

  const checkIcon = (
    <CheckIcon className="w-4 h-4 mr-3 text-green-600 dark:text-dark-green" />
  );
  const xIcon = (
    <XIcon className="w-4 h-4 mr-3 text-gray-600 dark:text-dark-gray-200" />
  );

  if (isLoading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8 flex-between">
        <PageTitle title="Billing" />
        <div className="hidden md:block">
          {isPro ? (
            <Button
              color="purple"
              variant="outlined"
              className="w-32 whitespace-nowrap"
              onClick={createCustomerPortalSession}
              loading={isCreatingSession}
            >
              Change Plan
            </Button>
          ) : (
            <Button
              color="purple"
              className="w-24"
              onClick={createCustomerPortalSession}
              loading={isCreatingSession}
            >
              Upgrade
            </Button>
          )}
        </div>
      </div>

      <Card className="dark:bg-dark-gray-800">
        <div className="flex items-center">
          <span className="text-2xl font-bold">{plan_name} Plan</span>
          {isTrialing && (
            <Badge color="green" className="inline-block ml-3">
              Trialing until {format(trialEndDate, 'MMM d')}
            </Badge>
          )}
        </div>

        <div className="my-6 font-bold">
          {price > 0 ? (
            <>
              <span className="text-xl">$10.00</span> / month
            </>
          ) : (
            <span className="text-xl">Free</span>
          )}
        </div>

        <div>What's included:</div>
        <div className="flex flex-col mt-4 text-sm md:flex-row">
          <div className="flex-1">
            <div className="flex items-center">
              {checkIcon}
              Unlimited songs, binders and sets
            </div>
            <div className="flex items-center mt-2">
              {checkIcon}
              Unlimited teams
            </div>
            <div className="flex items-center mt-2">
              {checkIcon}
              Permissions and access control
            </div>
            <div className="flex items-center mt-2">
              {checkIcon}
              Metronome
            </div>
            <div className="flex items-center mt-2">
              {checkIcon}
              Autoscroll
            </div>
          </div>
          <div className="flex-1 mt-6 md:mt-0">
            {!isPro && (
              <div className="mb-2 font-semibold text-gray-700 dark:text-dark-gray-200">
                Not included:
              </div>
            )}
            <div className="flex items-center">
              {isPro ? checkIcon : xIcon}Sessions
            </div>
            <div className="flex items-center mt-2">
              {isPro ? checkIcon : xIcon}Sticky notes
            </div>
            <div className="flex items-center mt-2">
              {isPro ? checkIcon : xIcon}File management
            </div>
            <div className="flex items-center mt-2">
              {isPro ? checkIcon : xIcon}Spotify, Apple Music and YouTube tracks
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-8 md:hidden">
        {isPro ? (
          <Button
            full={true}
            color="purple"
            variant="outlined"
            onClick={createCustomerPortalSession}
            loading={isCreatingSession}
          >
            Change Plan
          </Button>
        ) : (
          <Button
            full={true}
            color="purple"
            onClick={createCustomerPortalSession}
            loading={isCreatingSession}
          >
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
}
