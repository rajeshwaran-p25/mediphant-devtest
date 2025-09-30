import type { RecentCheck } from "../app/models";

interface RecentChecksProps {
  checks: RecentCheck[];
}

export default function RecentChecks({ checks }: RecentChecksProps) {
  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 1000
    );
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📋 Recent Checks
      </h3>
      <div className="space-y-3">
        {checks.map((check, index) => (
          <div
            key={`${check.timestamp}-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {check.isPotentiallyRisky ? "⚠️" : "✅"}
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  {check.medA} + {check.medB}
                </p>
                <p className="text-sm text-gray-600">
                  {check.isPotentiallyRisky
                    ? "Potential interaction"
                    : "No interaction found"}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {getTimeAgo(check.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
