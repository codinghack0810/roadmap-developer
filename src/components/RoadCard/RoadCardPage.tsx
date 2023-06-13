import { useState } from 'preact/hooks';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME, decodeToken } from '../../lib/jwt';
import { WideBadge } from './WideBadge';
import { LongBadge } from './LongBadge';

import { useCopyText } from '../../hooks/use-copy-text';
import {Editor} from "../Editor";

export type BadgeProps = {
  badgeUrl: string;
};

export function RoadCardPage() {
  const [selectedBadge, setSelectedBadge] = useState<'long' | 'wide'>('long');
  const [selectedVariant, setSelectedVariant] = useState<'dark' | 'light'>(
    'dark'
  );
  const { isCopied, copyText } = useCopyText();
  const { isCopied: isMarkdownCopied, copyText: handleMarkdownCopy } =
    useCopyText();

  const token = Cookies.get(TOKEN_COOKIE_NAME);
  if (!token) {
    return null;
  }
  const user = decodeToken(token);

  const badgeUrl = `${
    import.meta.env.PUBLIC_API_URL
  }/v1-badge/${selectedBadge}/${user.id}?variant=${selectedVariant}`;

  const textareaContent = `
<a href="${badgeUrl}">
  <img src="${badgeUrl}" alt="${user?.name}${user?.name && "'s"} Road Card"/>
</a>
    `.trim();

  const markdownSnippet = `
[![${user?.name}${user?.name && "'s"} Road Card](${badgeUrl})](${badgeUrl})
    `.trim();

  return (
    <>
      <div className="mb-8 hidden md:block">
        <h2 className="text-3xl font-bold sm:text-4xl">Road Card</h2>
        <p className="mt-2 text-gray-400">
          Grab your #RoadCard and share your progress with others.
        </p>
      </div>

      <div>
        <div className="mb-6 flex items-center border-b">
          <div className="flex items-center">
            <button
              className={`relative top-px flex items-center justify-center px-3 pb-3 leading-none shadow-gray-600 ${
                selectedBadge === 'long'
                  ? 'shadow-[inset_0_-1px_0_var(--tw-shadow-color)]'
                  : 'text-gray-600'
              }`}
              onClick={() => {
                setSelectedBadge('long');
                setSelectedVariant('dark');
              }}
            >
              Long
            </button>

            <button
              className={`relative top-px flex items-center justify-center px-3 pb-3 leading-none shadow-gray-600 ${
                selectedBadge === 'wide'
                  ? 'shadow-[inset_0_-1px_0_var(--tw-shadow-color)]'
                  : 'text-gray-600'
              }`}
              onClick={() => {
                setSelectedBadge('wide');
                setSelectedVariant('dark');
              }}
            >
              Wide
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          selectedBadge === 'long' && 'grid gap-6 sm:grid-cols-5'
        } ${selectedBadge === 'wide' && 'flex flex-col gap-6'}`}
      >
        {selectedBadge === 'long' && <LongBadge badgeUrl={badgeUrl} />}

        {selectedBadge === 'wide' && <WideBadge badgeUrl={badgeUrl} />}

        <div className={`${selectedBadge === 'long' && 'sm:col-span-3'}`}>
          <div>
            <span className="text-xs uppercase leading-none text-gray-400">
              Variation
            </span>

            <div className="mt-2 flex items-center gap-2">
              <button
                className={`flex h-7 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm leading-none hover:opacity-80 ${
                  selectedVariant === 'dark' && 'border-gray-300 bg-gray-100'
                }`}
                onClick={() => setSelectedVariant('dark')}
              >
                Dark
              </button>

              <button
                className={`flex h-7 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm leading-none hover:opacity-80 ${
                  selectedVariant === 'light' && 'border-gray-300 bg-gray-100'
                }`}
                onClick={() => setSelectedVariant('light')}
              >
                Light
              </button>
            </div>
          </div>

          <div
            className={`mt-4 flex gap-2 ${
              selectedBadge === 'long' && 'flex-col'
            }`}
          >
            <Editor title={'HTML'} text={textareaContent} />
            <Editor title={'Markdown'} text={markdownSnippet} />
          </div>

          <p className="mt-3 rounded-md border p-2 px-3 text-sm">
            Add this badge to your{' '}
            <a
              href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              GitHub profile.
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
