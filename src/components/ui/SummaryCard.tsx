
interface SummaryCardProps {
  title: string;
  total: number | string;
  items?: Array<{ id: string; label: string }>;
  onClick?: () => void;
  className?: string;
}

export default function SummaryCard({ 
  title, 
  total, 
  items, 
  onClick,
  className = ''
}: SummaryCardProps) {
  return (
    <div
      className={`bg-fcc-dark border border-fcc-divider rounded-lg p-6 ${
        onClick ? 'cursor-pointer hover:border-fcc-cyan transition-colors' : ''
      } ${className}`}
      onClick={onClick}
    >
      <h3 className="text-fcc-white text-sm font-medium mb-2">{title}</h3>
      <div className="text-3xl font-bold text-fcc-cyan mb-4">{total}</div>
      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className="text-sm text-fcc-white/70 truncate">
              {item.label}
            </li>
          ))}
          {items.length > 5 && (
            <li className="text-sm text-fcc-white">+{items.length - 5} more</li>
          )}
        </ul>
      )}
    </div>
  );
}

