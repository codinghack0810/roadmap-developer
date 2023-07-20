import { useStore } from '@nanostores/preact';
import { $toastMessage } from '../stores/toast';
import { useEffect } from 'preact/hooks';
import { CheckIcon } from './ReactIcons/CheckIcon';
import { ErrorIcon } from './ReactIcons/ErrorIcon';
import { WarningIcon } from './ReactIcons/WarningIcon';
import { InfoIcon } from './ReactIcons/InfoIcon';
import { Spinner } from './ReactIcons/Spinner';

export interface Props {}

export function Toaster(props: Props) {
  const toastMessage = useStore($toastMessage);

  useEffect(() => {
    if (toastMessage === undefined) {
      return;
    }

    const removeMessage = setTimeout(() => {
      if (toastMessage?.type !== 'loading') {
        $toastMessage.set(undefined);
      }
    }, 2500);

    return () => {
      clearTimeout(removeMessage);
    };
  }, [toastMessage]);

  if (!toastMessage) {
    return null;
  }

  return (
    <div
      onClick={() => {
        $toastMessage.set(undefined);
      }}
      className={`fixed bottom-5 left-1/2 max-w-[300px] animate-fade-slide-up min-w-[300px] sm:min-w-[auto] z-50`}
    >
      <div
        className={`flex -translate-x-1/2 transform cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white py-3 pl-4 pr-5 text-black shadow-md hover:bg-gray-50`}
      >
        {toastMessage.type === 'success' && (
          <CheckIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-green-500" />
        )}

        {toastMessage.type === 'error' && (
          <ErrorIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-red-500" />
        )}

        {toastMessage.type === 'warning' && (
          <WarningIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-orange-500" />
        )}

        {toastMessage.type === 'info' && (
          <InfoIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-blue-500" />
        )}

        {toastMessage.type === 'loading' && <Spinner isDualRing={false} />}

        <span className="flex-grow text-base">{toastMessage.message}</span>
      </div>
    </div>
  );
}
