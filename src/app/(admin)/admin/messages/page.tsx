"use client";

import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, Trash2, MailOpen, Calendar, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { MessageData } from "@/types";

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      toast("Failed to load messages", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !currentRead } : m))
        );
        toast(!currentRead ? "Marked as read" : "Marked as unread", "info");
      }
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        toast("Message deleted", "success");
        setDeleteConfirmId(null);
      }
    } catch {
      toast("Failed to delete message", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Inquiries Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review contact submissions, client requests, and freelance opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            {messages.filter((m) => !m.isRead).length} Unread
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            {messages.length} Total
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <Mail className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">Your inbox is completely clear!</p>
            <p className="text-slate-500">Submissions from the public contact form will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 rounded-xl border transition-all ${
                  msg.isRead
                    ? "bg-slate-900/60 border-slate-800 opacity-80"
                    : "bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-950/20"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        msg.isRead ? "bg-slate-800 text-slate-400" : "bg-indigo-600 text-white"
                      }`}
                    >
                      {msg.isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm">{msg.name}</p>
                        {!msg.isRead && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold">
                            NEW
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs font-mono text-cyan-400 hover:underline block"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(msg.createdAt).toLocaleDateString()} &bull;{" "}
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    <button
                      onClick={() => toggleRead(msg.id, msg.isRead)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title={msg.isRead ? "Mark unread" : "Mark read"}
                    >
                      <CheckCircle className={`w-4 h-4 ${msg.isRead ? "text-slate-500" : "text-emerald-400"}`} />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(msg.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {msg.subject && (
                  <p className="text-xs font-semibold text-slate-200 mb-2">
                    <span className="text-slate-500 font-normal">Subject: </span>
                    {msg.subject}
                  </p>
                )}

                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-2xl glass-panel max-w-sm w-full border border-rose-500/30 space-y-4">
            <h3 className="text-base font-bold text-white">Delete Message</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this inquiry?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
