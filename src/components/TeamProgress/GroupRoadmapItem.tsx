import { useState } from 'preact/hooks';
import type { GroupByRoadmap, TeamMember } from './TeamProgressPage';
import { MemberProgressModal } from './MemberProgressModal';
import { getUrlParams } from '../../lib/browser';
import ExternalLinkIcon from '../../icons/external-link.svg';

type GroupRoadmapItemProps = {
  roadmap: GroupByRoadmap;
};

export function GroupRoadmapItem(props: GroupRoadmapItemProps) {
  const { members, resourceTitle, resourceId } = props.roadmap;
  const { t: teamId } = getUrlParams();

  const [showAll, setShowAll] = useState(false);
  const [detailResourceId, setDetailResourceId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <>
      {detailResourceId && (
        <MemberProgressModal
          member={selectedMember!}
          teamId={teamId}
          resourceId={detailResourceId}
          resourceType={'roadmap'}
          onClose={() => {
            setDetailResourceId(null);
            setSelectedMember(null);
          }}
        />
      )}
      <div className="flex h-full min-h-[270px] flex-col rounded-md border">
        <div className="flex items-center gap-3 border-b p-3">
          <div className="flex min-w-0 flex-grow items-center justify-between">
            <h3 className="truncate font-medium">{resourceTitle}</h3>
            <a
              href={`/${resourceId}?t=${teamId}`}
              className="group mb-0.5 flex shrink-0 items-center justify-between text-base font-medium leading-none text-black"
              target={'_blank'}
            >
              <img
                alt={'link'}
                src={ExternalLinkIcon}
                className="ml-2 h-4 w-4 opacity-20 transition-opacity group-hover:opacity-100"
              />
            </a>
          </div>
        </div>
        <div className="relative flex grow flex-col space-y-2 p-3">
          {(showAll ? members : members.slice(0, 4)).map((member) => {
            if (!member.progress) return null;
            return (
              <button
                className="group relative w-full overflow-hidden rounded-md border p-2 hover:border-gray-300 hover:text-black focus:outline-none"
                key={member?.member._id}
                onClick={() => {
                  setDetailResourceId(member?.progress?.resourceId!);
                  setSelectedMember(member.member);
                }}
              >
                <span className="relative z-10 flex items-center justify-between gap-1 text-sm">
                  <span className="inline-grid grid-cols-[20px_auto] gap-2">
                    <img
                      src={
                        member.member.avatar
                          ? `${import.meta.env.PUBLIC_AVATAR_BASE_URL}/${
                              member.member.avatar
                            }`
                          : '/images/default-avatar.png'
                      }
                      alt={member.member.name || ''}
                      className="h-5 w-5 shrink-0 rounded-full"
                    />
                    <span className="truncate">{member?.member?.name}</span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {member?.progress?.done} / {member?.progress?.total}
                  </span>
                </span>
                <span
                  className="absolute inset-0 bg-gray-100 group-hover:bg-gray-200"
                  style={{
                    width: `${
                      (member?.progress?.done / member?.progress?.total) * 100
                    }%`,
                  }}
                />
              </button>
            );
          })}

          {members.length > 4 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className={'text-sm text-gray-400 underline'}
            >
              + {members.length - 4} more
            </button>
          )}

          {showAll && (
            <button
              onClick={() => setShowAll(false)}
              className={'text-sm text-gray-400 underline'}
            >
              - Show less
            </button>
          )}

          {members.length === 0 && (
            <div className="text-sm text-gray-500">No progress</div>
          )}
        </div>
      </div>
    </>
  );
}
