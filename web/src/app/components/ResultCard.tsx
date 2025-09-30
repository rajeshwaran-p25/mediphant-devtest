import type { InteractionResult } from "../models";

interface ResultCardProps {
  result: InteractionResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isRisky = result.isPotentiallyRisky;

  return (
    <div
      className={`mt-6 p-6 rounded-xl ${
        isRisky
          ? "bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
          : "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200"
      }`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`text-3xl ${isRisky ? "text-red-500" : "text-green-500"}`}
        >
          {isRisky ? "⚠️" : "✅"}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isRisky ? "Potential Interaction Found" : "No Interaction Found"}
          </h3>

          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Medications:</span>{" "}
              {result.medications.join(" + ")}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Reason:</span> {result.reason}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Advice:</span> {result.advice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
