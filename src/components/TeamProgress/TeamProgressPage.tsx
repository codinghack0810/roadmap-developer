import { useEffect, useState } from 'preact/hooks';
import { useTeamId } from '../../hooks/use-team-id';
import { httpGet } from '../../lib/http';
import { pageProgressMessage } from '../../stores/page';
import { MemberProgressItem } from './MemberProgressItem';
import { useToast } from '../../hooks/use-toast';
import { useStore } from '@nanostores/preact';
import { $currentTeam } from '../../stores/team';
import { GroupRoadmapItem } from './GroupRoadmapItem';
import { setUrlParams } from '../../lib/browser';
import { getUrlParams } from '../../lib/browser';
import { $toastMessage } from '../../stores/toast';

export type UserProgress = {
  resourceTitle: string;
  resourceType: 'roadmap' | 'best-practice';
  resourceId: string;
  isFavorite: boolean;
  done: number;
  learning: number;
  skipped: number;
  total: number;
  updatedAt: string;
};

export type TeamMember = {
  _id: string;
  role: string;
  name: string;
  email: string;
  avatar: string;
  progress: UserProgress[];
  updatedAt: string;
};

export type GroupByRoadmap = {
  resourceId: string;
  resourceTitle: string;
  resourceType: string;
  members: {
    member: TeamMember;
    progress: UserProgress | undefined;
  }[];
};

const groupingTypes = [
  { label: 'Members', value: 'member' },
  { label: 'Roadmaps', value: 'roadmap' },
] as const;

export function TeamProgressPage() {
  const { teamId } = useTeamId();
  const { gb: groupBy } = getUrlParams();

  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const currentTeam = useStore($currentTeam);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedGrouping, setSelectedGrouping] = useState<
    'roadmap' | 'member'
  >(groupBy || 'member');

  async function getTeamProgress() {
    const { response, error } = await httpGet<TeamMember[]>(
      `${import.meta.env.PUBLIC_API_URL}/v1-get-team-progress/${teamId}`
    );
    if (error || !response) {
      toast.error(error?.message || 'Failed to get team progress');
      return;
    }

    setTeamMembers(response);
  }

  useEffect(() => {
    if (!teamId) {
      return;
    }

    getTeamProgress().finally(() => {
      pageProgressMessage.set('');
      setIsLoading(false);
    });
  }, [teamId]);

  if (isLoading) {
    return null;
  }

  if (!teamId) {
    window.location.href = '/';
    return;
  }

  useEffect(() => {
    if (!selectedGrouping) {
      return;
    }

    setUrlParams({ gb: selectedGrouping });
  }, [selectedGrouping]);

  const groupByRoadmap: GroupByRoadmap[] = [];
  for (const roadmap of currentTeam?.roadmaps || []) {
    const members: GroupByRoadmap['members'] = [];
    for (const member of teamMembers) {
      const progress = member.progress.find(
        (progress) => progress.resourceId === roadmap
      );
      if (!progress) {
        continue;
      }
      members.push({
        member,
        progress,
      });
    }

    if (!members.length) {
      continue;
    }

    groupByRoadmap.push({
      resourceId: roadmap,
      resourceTitle: members?.[0].progress?.resourceTitle || '',
      resourceType: 'roadmap',
      members,
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {groupingTypes.map((grouping) => (
          <button
            className={`rounded-md border p-1 px-2 text-sm ${
              selectedGrouping === grouping.value
                ? ' border-gray-400 bg-gray-200 '
                : ''
            }`}
            onClick={() => setSelectedGrouping(grouping.value)}
          >
            {grouping.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {selectedGrouping === 'roadmap' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {groupByRoadmap.map((roadmap) => {
              return (
                <GroupRoadmapItem key={roadmap.resourceId} roadmap={roadmap} />
              );
            })}
          </div>
        )}
        {selectedGrouping === 'member' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {teamMembers.map((member) => (
              <MemberProgressItem teamId={teamId} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
