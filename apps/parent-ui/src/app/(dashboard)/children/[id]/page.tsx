"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Child } from "@/lib/api";

const CHARACTERS = [
  { id: "bear", emoji: "🐻", label: "Bear" },
  { id: "rabbit", emoji: "🐰", label: "Rabbit" },
  { id: "cat", emoji: "🐱", label: "Cat" },
];

const LANGUAGES = [
  { code: "zh", label: "Chinese" },
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
];

export default function EditChildPage() {
  const params = useParams();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.listChildren().then((children) => {
      const found = children.find((c) => c.id === params.id);
      setChild(found || null);
      setLoading(false);
    });
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!child) return;
    setError("");
    setSaving(true);
    try {
      const updated = await api.updateChild(child.id, {
        name: child.name,
        age: child.age,
        primary_language: child.primary_language,
        learning_languages: child.learning_languages,
        character_id: child.character_id,
      });
      setChild(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!child) return <div className="text-gray-500">Child not found</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-2xl">&larr;</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit {child.name}</h1>
          <p className="text-gray-500 text-sm">Update profile and settings</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm rounded-lg p-3">Saved!</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={child.name}
              onChange={(e) => setChild({ ...child, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <select
              value={child.age}
              onChange={(e) => setChild({ ...child, age: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none"
            >
              {[3, 4, 5, 6, 7, 8].map((a) => (
                <option key={a} value={a}>{a} years old</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Character</label>
          <div className="flex gap-3">
            {CHARACTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setChild({ ...child, character_id: c.id })}
                className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition ${
                  child.character_id === c.id ? "border-orange-400 bg-orange-50" : "border-gray-100"
                }`}
              >
                <span className="text-4xl">{c.emoji}</span>
                <span className="text-xs">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Language</label>
            <select
              value={child.primary_language}
              onChange={(e) => setChild({ ...child, primary_language: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning</label>
            <div className="flex gap-2">
              {LANGUAGES.filter((l) => l.code !== child.primary_language).map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    const langs = child.learning_languages.includes(l.code)
                      ? child.learning_languages.filter((x) => x !== l.code)
                      : [...child.learning_languages, l.code];
                    setChild({ ...child, learning_languages: langs });
                  }}
                  className={`px-3 py-2 rounded-xl text-sm border transition ${
                    child.learning_languages.includes(l.code)
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {child.login_code && (
          <div className="bg-orange-50 rounded-xl px-5 py-3">
            <p className="text-xs text-gray-500 mb-1">Login Code</p>
            <p className="text-2xl font-mono font-bold text-orange-600 tracking-[0.3em]">{child.login_code}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
