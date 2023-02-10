import AdjustmentsIcon from '@heroicons/react/outline/AdjustmentsIcon';
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setSetlistBeingPresented } from '../store/presenterSlice';
import Button from './Button';

export default function EditorNavbar({
  dirty,
  name,
  onSave,
  saving,
  onToggleFormatOptions,
  isFormatOpen,
}) {
  const router = useHistory();
  const dispatch = useDispatch();

  function handleGoBack() {
    dispatch(setSetlistBeingPresented({}));
    router.goBack();
  }

  return (
    <div className="border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800">
      <div className="container px-3 py-2 mx-auto flex-between">
        <div className="flex items-center">
          <span className="mr-4 flex-center">
            <Button
              variant="icon"
              size="md"
              color="gray"
              onClick={handleGoBack}
            >
              <ArrowNarrowLeftIcon className="w-6 h-6" />
            </Button>
          </span>
          <h1 className="text-base font-bold text-center dark:text-dark-gray-100">
            {name}
          </h1>
        </div>
        <div className="flex items-center">
          <Button
            variant="icon"
            size="lg"
            color={isFormatOpen ? 'blue' : 'gray'}
            onClick={onToggleFormatOptions}
            className="sm:mr-4"
          >
            <AdjustmentsIcon className="w-5 h-5" />
          </Button>
          <span className="fixed bottom-0 left-0 z-20 w-full p-3 sm:p-0 sm:w-auto sm:relative">
            <div className="w-full sm:w-20">
              <Button
                disabled={!dirty}
                onClick={onSave}
                loading={saving}
                full={true}
              >
                Save
              </Button>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}
