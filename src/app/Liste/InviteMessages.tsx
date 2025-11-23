import React from "react";
import { ListInvites, } from "@/types/api";
import { formatGroupInvite } from "@/utils/formatters";

const InviteMessage: React.FC<ListInvites> = ({ invites }) => {

  return (
    <div className="space-y-6">
      {invites.map(i => {
        if(i.Reponse && i.Message && i.Message !="") {
            console.log(i.Message)
            return (
                <div key={i.documentId}>
                    <h2 className="text-xl font-semibold mb-2">Messages de {formatGroupInvite(i.Qui)}</h2>
                    <p style={{ whiteSpace: 'pre-line' }}>{i.Message}</p>
                </div>
            )
      }})}
        
    </div>
  );
};

export default InviteMessage;
