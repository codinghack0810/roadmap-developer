import { useEffect, useState } from 'react';
import { httpGet } from '../../lib/http';
import { pageProgressMessage } from '../../stores/page';
import {
  CreateRoadmapModal,
  type RoadmapDocument,
} from './CreateRoadmap/CreateRoadmapModal';
import { PersonalRoadmapList } from './PersonalRoadmapList';
import type { ListFriendsResponse } from '../Friends/FriendsPage';
import { useToast } from '../../hooks/use-toast';
import { SharedRoadmapList } from './SharedRoadmapList';
import type { FriendshipStatus } from '../Befriend';

export type FriendUserType = {
  id: string;
  name: string;
  avatar: string;
  status: FriendshipStatus;
};

export type GetRoadmapListResponse = {
  personalRoadmaps: RoadmapDocument[];
  sharedRoadmaps: (RoadmapDocument & {
    creator: FriendUserType;
  })[];
};

type TabType = {
  label: string;
  value: 'personal' | 'shared';
};

const tabTypes: TabType[] = [
  { label: 'Personal', value: 'personal' },
  { label: 'Shared', value: 'shared' },
];

export function RoadmapListPage() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType['value']>('personal');
  const [allRoadmaps, setAllRoadmaps] = useState<GetRoadmapListResponse>({
    personalRoadmaps: [],
    sharedRoadmaps: [],
  });

  async function loadRoadmapList() {
    setIsLoading(true);
    const { response, error } = await httpGet<GetRoadmapListResponse>(
      `${import.meta.env.PUBLIC_API_URL}/v1-get-user-roadmap-list`
    );

    if (error || !response) {
      console.error(error);
      toast.error(error?.message || 'Something went wrong, please try again');
      return;
    }

    setAllRoadmaps(
      response! || {
        personalRoadmaps: [],
        sharedRoadmaps: [],
      }
    );
  }

  useEffect(() => {
    loadRoadmapList().finally(() => {
      setIsLoading(false);
      pageProgressMessage.set('');
    });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div>
      {isCreatingRoadmap && (
        <CreateRoadmapModal onClose={() => setIsCreatingRoadmap(false)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {tabTypes.map((tab) => {
            return (
              <button
                key={tab.value}
                className={`relative flex items-center justify-center rounded-md border p-1 px-3 text-sm ${
                  activeTab === tab.value ? ' border-gray-400 bg-gray-200 ' : ''
                } w-full sm:w-auto`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          className={`relative flex w-full items-center justify-center rounded-md border p-1 px-3 text-sm sm:w-auto`}
          onClick={() => setIsCreatingRoadmap(true)}
        >
          + Create Roadmap
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'personal' && (
          <PersonalRoadmapList
            roadmaps={allRoadmaps?.personalRoadmaps}
            onDelete={(roadmapId) => {
              setAllRoadmaps({
                ...allRoadmaps,
                personalRoadmaps: allRoadmaps.personalRoadmaps.filter(
                  (r) => r._id !== roadmapId
                ),
              });
            }}
          />
        )}
        {activeTab === 'shared' && (
          <SharedRoadmapList roadmaps={allRoadmaps?.sharedRoadmaps} />
        )}
      </div>
    </div>
  );
}
