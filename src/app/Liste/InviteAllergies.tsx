import React from "react";
import { ListInvites, } from "@/types/api";
import { formatGroupInvite } from "@/utils/formatters";

const InviteAllergies: React.FC<ListInvites> = ({ invites }) => {

  return (
    <div className="space-y-6">
      {invites.map(i => {
        if(i.Reponse && i.Allergies && i.Allergies !="") {
            return (
                <div key={i.id}>
                    <h2 className="text-xl font-semibold mb-2">Allergie(s) pour {formatGroupInvite(i.Qui)}</h2>
                    <p style={{ whiteSpace: 'pre-line' }}>{i.Allergies}</p>
                </div>
            )
      }})}
        
    </div>
  );
};

export default InviteAllergies;
