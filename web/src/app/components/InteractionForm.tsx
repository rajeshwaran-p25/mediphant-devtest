"use client";

import { useState } from "react";

interface InteractionFormProps {
  onSubmit: (medA: string, medB: string) => void;
  loading: boolean;
}

export default function InteractionForm({
  onSubmit,
  loading,
}: InteractionFormProps) {
  const [medA, setMedA] = useState("");
  const [medB, setMedB] = useState("");
  const [errors, setErrors] = useState<{ medA?: string; medB?: string }>({});

  const validate = (): boolean => {
    const newErrors: { medA?: string; medB?: string } = {};

    const trimmedA = medA.trim();
    const trimmedB = medB.trim();

    if (!trimmedA) {
      newErrors.medA = "First medication is required";
    } else if (trimmedA.length < 2) {
      newErrors.medA = "Please enter at least 2 characters";
    }

    if (!trimmedB) {
      newErrors.medB = "Second medication is required";
    } else if (trimmedB.length < 2) {
      newErrors.medB = "Please enter at least 2 characters";
    }

    if (
      !newErrors.medA &&
      !newErrors.medB &&
      trimmedA.toLowerCase() === trimmedB.toLowerCase()
    ) {
      newErrors.medB = "Please enter two different medications";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(medA.trim(), medB.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="medA"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          First Medication
        </label>
        <input
          type="text"
          id="medA"
          value={medA}
          onChange={(e) => {
            setMedA(e.target.value);
            if (errors.medA) setErrors({ ...errors, medA: undefined });
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.medA ? "border-red-500" : "border-gray-300"
          } text-gray-900`}
          placeholder="e.g., warfarin"
          disabled={loading}
        />
        {errors.medA && (
          <p className="mt-1 text-sm text-red-600">{errors.medA}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="medB"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Second Medication
        </label>
        <input
          type="text"
          id="medB"
          value={medB}
          onChange={(e) => {
            setMedB(e.target.value);
            if (errors.medB) setErrors({ ...errors, medB: undefined });
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.medB ? "border-red-500" : "border-gray-300"
          } text-gray-900`}
          placeholder="e.g., ibuprofen"
          disabled={loading}
        />
        {errors.medB && (
          <p className="mt-1 text-sm text-red-600">{errors.medB}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">Checking...</span>
        ) : (
          "Check"
        )}
      </button>
    </form>
  );
}
