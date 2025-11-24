"use client";

import { useState, useEffect } from "react";
import InviteInfo from "./InviteInfo";
import PresenceList from "./PresenceList";
import InviteMessage from "./InviteMessages";
import InviteAllergies from "./InviteAllergies";
import type { Invite } from "@/types/api";

export default function ListePage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("presence");

  // 🔥 Fetch côté client au mount et à chaque reload
  useEffect(() => {
    async function fetchInvites() {
      setLoading(true);
      try {
        const res = await fetch('/api/getInvites', {
          cache: 'no-store'
        });
        const data = await res.json();
        setInvites(data);
      } catch (error) {
        console.error('Error fetching invites:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInvites();
  }, []); // Se déclenche à chaque reload de la page

  const renderTab = () => {
    if (loading) return <div>Chargement...</div>;
    
    switch (tab) {
      case "info":
        return <InviteInfo invites={invites} />;
      case "presence":
        return <PresenceList invites={invites} />;
      case "messages":
        return <InviteMessage invites={invites} />;
      case "allergies":
        return <InviteAllergies invites={invites} />;
      default:
        return <div>Onglet inconnu</div>;
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{"Répondre à l'invitation"}</h1>

      <div className="flex mb-4 space-x-2 border-b">
        <button
          onClick={() => setTab("presence")}
          className={`px-4 py-2 border-b-2 font-medium ${
            tab === "presence" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
          }`}
        >
          Présences
        </button>
        <button
          onClick={() => setTab("info")}
          className={`px-4 py-2 border-b-2 font-medium ${
            tab === "info" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
          }`}
        >
          Infos des invités
        </button>
        <button
          onClick={() => setTab("messages")}
          className={`px-4 py-2 border-b-2 font-medium ${
            tab === "messages" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setTab("allergies")}
          className={`px-4 py-2 border-b-2 font-medium ${
            tab === "allergies" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
          }`}
        >
          Allergies
        </button>
      </div>

      {renderTab()}
    </div>
  );
}