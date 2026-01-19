export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-admin-text-primary">
        Welcome back, Agent
      </h1>

      {/* Test Card using your global CSS classes */}
      <div className="admin-card p-6">
        <h3 className="text-lg font-medium text-admin-accent mb-2">
          System Check
        </h3>
        <p className="text-admin-text-muted">
          If you can see this card, your layout and theme variables are working
          perfectly.
        </p>
      </div>
    </div>
  );
}
