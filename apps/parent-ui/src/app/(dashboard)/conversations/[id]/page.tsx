"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ConversationDetail } from "@/lib/api";
import { format, parseISO } from "date-fns";

const ROLE_CONFIG: Record<string, { label: string; bg: string; align: string }> = {
  child: { label: "Child", bg: "bg-blue-50", align: "justify-end" },
  character: { label: "Character", bg: "bg-orange-50", align: "justify-start" },
  system: { label: "System", bg: "bg-gray-50", align: "justify-center" },
};

const EMOTION_EMOJI: Record<string, string> = {
  happy: "😊",
  excited: "🤩",
  curious: "🤔",
  sad: "😢",
  frustrated: "😤",
  proud: "🥳",
  encouraging: "💪",
  empathetic: "🤗",
  patient: "😌",
  gentle: "🥰",
  neutral: "😐",
};

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [conv, setConv] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      api
        .getConversation(params.id as string)
        .then(setConv)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!conv) return <div className="text-gray-500">Conversation not found</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-2xl">&larr;</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Conversation</h1>
          <p className="text-sm text-gray-500">
            {format(parseISO(conv.started_at), "MMM dd, yyyy h:mm a")}
            {" · "}
            {conv.total_tokens.toLocaleString()} tokens
            {" · "}
            ${conv.estimated_cost_usd.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {conv.messages.map((msg) => {
          const config = ROLE_CONFIG[msg.role] || ROLE_CONFIG.system;
          return (
            <div key={msg.id} className={`flex ${config.align}`}>
              <div className={`${config.bg} rounded-2xl px-5 py-3 max-w-[80%]`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">{config.label}</span>
                  {msg.emotion && (
                    <span className="text-sm" title={msg.emotion}>
                      {EMOTION_EMOJI[msg.emotion] || msg.emotion}
                    </span>
                  )}
                  {msg.language && (
                    <span className="text-xs text-gray-400">{msg.language.toUpperCase()}</span>
                  )}
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(parseISO(msg.created_at), "h:mm:ss a")}
                </p>
              </div>
            </div>
          );
        })}

        {conv.messages.length === 0 && (
          <p className="text-center text-gray-400 py-8">No messages in this conversation.</p>
        )}
      </div>
    </div>
  );
}
