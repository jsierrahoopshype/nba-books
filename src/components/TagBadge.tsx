'use client';

interface TagBadgeProps {
  label: string;
  type?: 'player' | 'team' | 'topic' | 'default';
  onClick?: () => void;
}

export function TagBadge({ label, type = 'default', onClick }: TagBadgeProps) {
  const colors = {
    player: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    team: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    topic: 'bg-green-100 text-green-700 hover:bg-green-200',
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  const className = `text-xs px-2 py-0.5 rounded ${colors[type]} ${onClick ? 'cursor-pointer' : ''}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {label}
      </button>
    );
  }

  return <span className={className}>{label}</span>;
}

interface TagListProps {
  players?: string[];
  teams?: string[];
  topics?: string[];
  onTagClick?: (type: string, value: string) => void;
}

export function TagList({ players = [], teams = [], topics = [], onTagClick }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {players.map(player => (
        <TagBadge
          key={`player-${player}`}
          label={player}
          type="player"
          onClick={onTagClick ? () => onTagClick('player', player) : undefined}
        />
      ))}
      {teams.map(team => (
        <TagBadge
          key={`team-${team}`}
          label={team}
          type="team"
          onClick={onTagClick ? () => onTagClick('team', team) : undefined}
        />
      ))}
      {topics.map(topic => (
        <TagBadge
          key={`topic-${topic}`}
          label={topic}
          type="topic"
          onClick={onTagClick ? () => onTagClick('topic', topic) : undefined}
        />
      ))}
    </div>
  );
}