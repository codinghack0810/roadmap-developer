import { type FormEvent, useEffect, useState } from 'react';
import { httpGet, httpPatch } from '../../lib/http';
import { pageProgressMessage } from '../../stores/page';
import type {
  AllowedCustomRoadmapVisibility,
  AllowedProfileVisibility,
  AllowedRoadmapVisibility,
  UserDocument,
} from '../../api/user';
import { SelectionButton } from '../RoadCard/SelectionButton';
import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  Globe,
  LockIcon,
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { CreateRoadmapModal } from '../CustomRoadmap/CreateRoadmap/CreateRoadmapModal.tsx';

type RoadmapType = {
  id: string;
  title: string;
  isCustomResource: boolean;
};

type GetProfileSettingsResponse = Pick<
  UserDocument,
  'username' | 'profileVisibility' | 'publicConfig' | 'links'
>;

export function UpdatePublicProfileForm() {
  const [profileVisibility, setProfileVisibility] =
    useState<AllowedProfileVisibility>('private');

  const toast = useToast();

  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  const [publicProfileUrl, setPublicProfileUrl] = useState('');
  const [isAvailableForHire, setIsAvailableForHire] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(true);
  const [headline, setHeadline] = useState('');
  const [username, setUsername] = useState('');
  const [roadmapVisibility, setRoadmapVisibility] =
    useState<AllowedRoadmapVisibility>('all');
  const [customRoadmapVisibility, setCustomRoadmapVisibility] =
    useState<AllowedCustomRoadmapVisibility>('all');
  const [roadmaps, setRoadmaps] = useState<string[]>([]);
  const [customRoadmaps, setCustomRoadmaps] = useState<string[]>([]);

  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');

  const [profileRoadmaps, setProfileRoadmaps] = useState<RoadmapType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { response, error } = await httpPatch(
      `${import.meta.env.PUBLIC_API_URL}/v1-update-public-profile-config`,
      {
        isAvailableForHire,
        isEmailVisible,
        profileVisibility,
        headline,
        username,
        roadmapVisibility,
        customRoadmapVisibility,
        roadmaps,
        customRoadmaps,
        github,
        twitter,
        linkedin,
        website,
      },
    );

    if (error || !response) {
      setIsLoading(false);
      toast.error(error?.message || 'Something went wrong');

      return;
    }

    await loadProfileSettings();
    toast.success('Profile updated successfully');
  };

  const loadProfileSettings = async () => {
    setIsLoading(true);

    const { error, response } = await httpGet<UserDocument>(
      `${import.meta.env.PUBLIC_API_URL}/v1-get-profile-settings`,
    );

    if (error || !response) {
      setIsLoading(false);
      toast.error(error?.message || 'Something went wrong');

      return;
    }

    const {
      links,
      username,
      profileVisibility: defaultProfileVisibility,
      publicConfig,
    } = response;

    setPublicProfileUrl(username ? `/u/${username}` : '');
    setUsername(username || '');
    setGithub(links?.github || '');
    setTwitter(links?.twitter || '');
    setLinkedin(links?.linkedin || '');
    setWebsite(links?.website || '');
    setProfileVisibility(defaultProfileVisibility || 'private');
    setHeadline(publicConfig?.headline || '');
    setRoadmapVisibility(publicConfig?.roadmapVisibility || 'none');
    setCustomRoadmapVisibility(publicConfig?.customRoadmapVisibility || 'none');
    setCustomRoadmaps(publicConfig?.customRoadmaps || []);
    setRoadmaps(publicConfig?.roadmaps || []);
    setCustomRoadmapVisibility(publicConfig?.customRoadmapVisibility || 'none');
    setIsAvailableForHire(publicConfig?.isAvailableForHire || false);
    setIsEmailVisible(publicConfig?.isEmailVisible ?? true);

    setIsLoading(false);
  };

  const loadProfileRoadmaps = async () => {
    setIsLoading(true);

    const { error, response } = await httpGet<{
      roadmaps: RoadmapType[];
    }>(`${import.meta.env.PUBLIC_API_URL}/v1-get-profile-roadmaps`);

    if (error || !response) {
      setIsLoading(false);
      toast.error(error?.message || 'Something went wrong');

      return;
    }

    setProfileRoadmaps(response?.roadmaps || []);
    setIsLoading(false);
  };

  const updateProfileVisibility = async (
    visibility: AllowedProfileVisibility,
  ) => {
    pageProgressMessage.set('Updating profile visibility');
    setIsLoading(true);

    const { error } = await httpPatch(
      `${import.meta.env.PUBLIC_API_URL}/v1-update-public-profile-visibility`,
      {
        profileVisibility: visibility,
      },
    );

    if (error) {
      setIsLoading(false);
      toast.error(error.message || 'Something went wrong');

      return;
    }

    setProfileVisibility(visibility);
    setIsLoading(false);
    pageProgressMessage.set('');
  };

  // Make a request to the backend to fill in the form with the current values
  useEffect(() => {
    Promise.all([loadProfileSettings(), loadProfileRoadmaps()]).finally(() => {
      pageProgressMessage.set('');
    });
  }, []);

  const publicCustomRoadmaps = profileRoadmaps.filter(
    (r) => r.isCustomResource,
  );
  const publicRoadmaps = profileRoadmaps.filter((r) => !r.isCustomResource);

  const isAllCustomRoadmapsSelected =
    customRoadmaps.length === publicCustomRoadmaps.length ||
    customRoadmapVisibility === 'all';
  const isAllRoadmapsSelected =
    roadmaps.length === publicRoadmaps.length || roadmapVisibility === 'all';

  return (
    <>
      {isCreatingRoadmap && (
        <CreateRoadmapModal onClose={() => setIsCreatingRoadmap(false)} />
      )}

      <div className="mt-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">Public Profile</h3>
          {publicProfileUrl && (
            <a
              href={publicProfileUrl}
              target="_blank"
              className="flex shrink-0 flex-row items-center gap-1 rounded-md border border-black py-0.5 pl-1 pr-1.5 text-xs transition-colors hover:bg-black hover:text-white"
            >
              <ArrowUpRight className="h-3 w-3 stroke-[3]" />
              Visit Profile
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SelectionButton
            type="button"
            text="Public"
            icon={Globe}
            isDisabled={profileVisibility === 'public'}
            isSelected={profileVisibility === 'public'}
            onClick={() => updateProfileVisibility('public')}
          />
          <SelectionButton
            type="button"
            text="Private"
            icon={LockIcon}
            isDisabled={profileVisibility === 'private'}
            isSelected={profileVisibility === 'private'}
            onClick={() => updateProfileVisibility('private')}
          />
        </div>
      </div>
      <form className="mt-6 space-y-4 pb-10" onSubmit={handleSubmit}>
        <div className="flex w-full flex-col">
          <label
            htmlFor="headline"
            className="text-sm leading-none text-slate-500"
          >
            Headline
          </label>
          <input
            type="text"
            name="headline"
            id="headline"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="Full Stack Developer"
            value={headline}
            onChange={(e) => setHeadline((e.target as HTMLInputElement).value)}
            required={profileVisibility === 'public'}
          />
        </div>
        <div className="flex w-full flex-col">
          <label
            htmlFor="username"
            className="text-sm leading-none text-slate-500"
          >
            Username
          </label>
          <div className="mt-2 flex items-center overflow-hidden rounded-lg border border-gray-300">
            <span className="border-r border-gray-300 bg-gray-100 p-2">
              roadmap.sh/u/
            </span>

            <input
              type="text"
              name="username"
              id="username"
              className="w-full px-3 py-2 outline-none placeholder:text-gray-400"
              placeholder="johndoe"
              spellCheck={false}
              value={username}
              title="Username must be at least 3 characters long and can only contain letters, numbers, and underscores"
              onChange={(e) =>
                setUsername((e.target as HTMLInputElement).value)
              }
              required={profileVisibility === 'public'}
            />
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium">
            Which roadmap progresses do you want to show on your profile?
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <SelectionButton
              type="button"
              text="All Progress"
              icon={Eye}
              isDisabled={false}
              isSelected={roadmapVisibility === 'all'}
              onClick={() => {
                setRoadmapVisibility('all');
                setRoadmaps([]);
              }}
            />
            <SelectionButton
              type="button"
              icon={EyeOff}
              text="Hide my Progress"
              isDisabled={false}
              isSelected={roadmapVisibility === 'none'}
              onClick={() => {
                setRoadmapVisibility('none');
                setRoadmaps([]);
              }}
            />
          </div>

          <h3 className="mt-4 text-sm text-gray-400">
            Or select the roadmaps you want to show
          </h3>
          {publicRoadmaps.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {publicRoadmaps.map((r) => (
                <SelectionButton
                  type="button"
                  key={r.id}
                  text={r.title}
                  isDisabled={false}
                  isSelected={roadmaps.includes(r.id)}
                  onClick={() => {
                    if (roadmapVisibility !== 'selected') {
                      setRoadmapVisibility('selected');
                    }

                    if (roadmaps.includes(r.id)) {
                      setRoadmaps(roadmaps.filter((id) => id !== r.id));
                    } else {
                      setRoadmaps([...roadmaps, r.id]);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 rounded-lg bg-yellow-100 p-2 text-sm text-yellow-700">
              Update{' '}
              <a
                target="_blank"
                className="font-medium underline underline-offset-2 hover:text-yellow-800"
                href="/roadmaps"
              >
                your progress on roadmaps
              </a>{' '}
              to show your learning activity.
            </p>
          )}
        </div>

        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium">
            Pick your custom roadmaps to show on your profile
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <SelectionButton
              type="button"
              text="All Roadmaps"
              icon={Eye}
              isDisabled={false}
              isSelected={customRoadmapVisibility === 'all'}
              onClick={() => {
                setCustomRoadmapVisibility('all');
                setCustomRoadmaps([]);
              }}
            />
            <SelectionButton
              type="button"
              text="Hide my Custom Roadmaps"
              icon={EyeOff}
              isDisabled={false}
              isSelected={customRoadmapVisibility === 'none'}
              onClick={() => {
                setCustomRoadmapVisibility('none');
                setCustomRoadmaps([]);
              }}
            />
          </div>

          <h3 className="mt-4 text-sm text-gray-400">
            Or select the custom roadmaps you want to show
          </h3>
          {publicCustomRoadmaps.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {publicCustomRoadmaps.map((r) => (
                <SelectionButton
                  type="button"
                  key={r.id}
                  text={r.title}
                  isDisabled={false}
                  isSelected={customRoadmaps.includes(r.id)}
                  onClick={() => {
                    if (customRoadmapVisibility !== 'selected') {
                      setCustomRoadmapVisibility('selected');
                    }

                    if (customRoadmaps.includes(r.id)) {
                      setCustomRoadmaps(
                        customRoadmaps.filter((id) => id !== r.id),
                      );
                    } else {
                      setCustomRoadmaps([...customRoadmaps, r.id]);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 rounded-lg bg-yellow-100 p-2 text-sm text-yellow-700">
              You do not have any custom roadmaps.{' '}
              <button
                type={'button'}
                className="font-medium underline underline-offset-2 hover:text-yellow-800"
                onClick={() => {
                  setIsCreatingRoadmap(true);
                }}
              >
                Create one now
              </button>
              .
            </p>
          )}
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="github"
            className="text-sm leading-none text-slate-500"
          >
            Github
          </label>
          <input
            type="text"
            name="github"
            id="github"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://github.com/username"
            value={github}
            onChange={(e) => setGithub((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="flex w-full flex-col">
          <label
            htmlFor="twitter"
            className="text-sm leading-none text-slate-500"
          >
            Twitter
          </label>
          <input
            type="text"
            name="twitter"
            id="twitter"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://twitter.com/username"
            value={twitter}
            onChange={(e) => setTwitter((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="linkedin"
            className="text-sm leading-none text-slate-500"
          >
            LinkedIn
          </label>
          <input
            type="text"
            name="linkedin"
            id="linkedin"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://www.linkedin.com/in/username/"
            value={linkedin}
            onChange={(e) => setLinkedin((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="website"
            className="text-sm leading-none text-slate-500"
          >
            Website
          </label>
          <input
            type="text"
            name="website"
            id="website"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex select-none items-center gap-2 rounded-md border px-2 hover:bg-gray-100">
            <input
              type="checkbox"
              name="isEmailVisible"
              id="isEmailVisible"
              checked={isEmailVisible}
              onChange={(e) => setIsEmailVisible(e.target.checked)}
            />
            <label
              htmlFor="isEmailVisible"
              className="flex-grow cursor-pointer py-1.5"
            >
              Make my email public
            </label>
          </div>

          <div className="flex select-none items-center gap-2 rounded-md border px-2 hover:bg-gray-100">
            <input
              type="checkbox"
              name="isAvailableForHire"
              id="isAvailableForHire"
              checked={isAvailableForHire}
              onChange={(e) => setIsAvailableForHire(e.target.checked)}
            />
            <label
              htmlFor="isAvailableForHire"
              className="flex-grow cursor-pointer py-1.5"
            >
              Available for Hire
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
        >
          {isLoading ? 'Please wait...' : 'Update Public Profile'}
        </button>
      </form>
    </>
  );
}
