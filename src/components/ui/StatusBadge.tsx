interface StatusBadgeProps {
  status: 'success' | 'failed' | 'pending' | 'completed';
  children?: React.ReactNode;
}

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  const colors = {
    success: 'bg-green-500/20 text-green-400 border-green-500/50',
    failed: 'bg-red-500/20 text-red-400 border-red-500/50',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    completed: 'bg-fcc-cyan/20 text-fcc-cyan border-fcc-cyan/50',
  };

  const labels = {
    success: 'Success',
    failed: 'Failed',
    pending: 'Pending',
    completed: 'Completed',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]}`}
    >
      {children || labels[status]}
    </span>
  );
}

