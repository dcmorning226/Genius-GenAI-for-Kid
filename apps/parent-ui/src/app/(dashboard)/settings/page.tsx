"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [dailyTokenLimit, setDailyTokenLimit] = useState("50000");
  const [dailyCostLimit, setDailyCostLimit] = useState("1.00");
  const [usageStart, setUsageStart] = useState("08:00");
  const [usageEnd, setUsageEnd] = useState("20:00");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Settings saved locally for now - will be persisted to backend in future
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "companion_settings",
        JSON.stringify({ dailyTokenLimit, dailyCostLimit, usageStart, usageEnd })
      );
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure limits and preferences</p>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="text-gray-800">{user?.name || "Not set"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Timezone</span>
            <span className="text-gray-800">{user?.timezone}</span>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Daily Usage Limits</h2>
        <p className="text-xs text-gray-400">Set boundaries for your child&apos;s daily AI usage</p>

        {saved && <div className="bg-green-50 text-green-600 text-sm rounded-lg p-2">Settings saved!</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Tokens / Day</label>
            <input
              type="number"
              value={dailyTokenLimit}
              onChange={(e) => setDailyTokenLimit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm"
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Cost / Day (USD)</label>
            <input
              type="number"
              step="0.01"
              value={dailyCostLimit}
              onChange={(e) => setDailyCostLimit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm"
              placeholder="1.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Allowed Usage Hours</label>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={usageStart}
              onChange={(e) => setUsageStart(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="time"
              value={usageEnd}
              onChange={(e) => setUsageEnd(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
        >
          Save Settings
        </button>
      </div>

      {/* Safety */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-2">Safety</h2>
        <p className="text-xs text-gray-400 mb-4">Content safety is always enabled and cannot be disabled</p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Age-appropriate content filter</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Always On</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Personal info protection</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Always On</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Harmful content blocking</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Always On</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Sensitive topic redirect</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Always On</span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <h2 className="font-semibold text-red-600 mb-2">Danger Zone</h2>
        <button
          onClick={logout}
          className="text-red-500 hover:text-red-600 text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
