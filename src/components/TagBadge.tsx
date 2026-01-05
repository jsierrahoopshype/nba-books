interface TagBadgeProps {
  label: string;
  variant?: 'default' | 'topic' | 'player' | 'team' | 'format' | 'category';
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  topic: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  player: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  team: 'bg-green-100 text-green-700 hover:bg-green-200',
  format: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  category: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
};

export function TagBadge({
  label,
  variant = 'default',
  onClick,
  selected = false,
  size = 'sm',
}: TagBadgeProps) {
  const baseClasses = `
    inline-flex items-center rounded-full font-medium
    transition-all duration-150
    ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
    ${variantStyles[variant]}
    ${selected ? 'ring-2 ring-offset-1 ring-primary-500' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  if (onClick) {
    return (
      <button
        type="button"
        className={baseClasses}
        onClick={onClick}
        aria-pressed={selected}
      >
        {label}
        {selected && (
          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    );
  }

  return <span className={baseClasses}>{label}</span>;
}

interface TagListProps {
  tags: string[];
  variant?: TagBadgeProps['variant'];
  limit?: number;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export function TagList({
  tags,
  variant = 'default',
  limit,
  onTagClick,
  selectedTags = [],
}: TagListProps) {
  const displayTags = limit ? tags.slice(0, limit) : tags;
  const remaining = limit && tags.length > limit ? tags.length - limit : 0;

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTags.map((tag) => (
        <TagBadge
          key={tag}
          label={tag}
          variant={variant}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
          selected={selectedTags.includes(tag)}
        />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-500 self-center">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
