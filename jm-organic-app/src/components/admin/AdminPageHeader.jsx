import { Link } from 'react-router-dom';

export default function AdminPageHeader({ title, action }) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-card">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">JM Organic Foods · Admin</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{today}</span>
        {action ?? (
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            ← Back to Shop
          </Link>
        )}
      </div>
    </div>
  );
}

//export default AdminPageHeader;