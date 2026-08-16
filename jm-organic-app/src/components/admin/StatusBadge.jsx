// Matches the two status styles seen in the Rocket screenshots:
// - plain colored text (DELIVERED, PROCESSING, ACTIVE, LOW)
// - rounded pill (SHIPPED, PENDING, CANCELLED, OUT)

const TEXT_STYLES = {
  DELIVERED: 'text-primary',
  PROCESSING: 'text-foreground',
  ACTIVE: 'text-primary',
  LOW: 'text-accent',
};

const PILL_STYLES = {
  SHIPPED: 'bg-secondary text-primary',
  PENDING: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-red-100 text-red-600',
  OUT: 'bg-red-100 text-red-600',
};

export default function StatusBadge({ status }) {
  const key = String(status).toUpperCase();

  if (PILL_STYLES[key]) {
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${PILL_STYLES[key]}`}>
        {key}
      </span>
    );
  }

  return (
    <span className={`text-xs font-semibold tracking-wide ${TEXT_STYLES[key] || 'text-foreground'}`}>
      {key}
    </span>
  );
}

