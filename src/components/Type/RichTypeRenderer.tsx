'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Paragraph } from '@/types/api';

interface RichTextRendererProps {
  content?: Paragraph[] | string;
  className?: string;
}

type RichChild = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

function hasChildren(
  block: Paragraph | unknown
): block is Paragraph & { children: RichChild[] } {
  return (
    typeof block === "object" &&
    block !== null &&
    "children" in block &&
    Array.isArray((block as { children?: unknown }).children)
  );
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  // Cas 1 : Contenu vide
  if (!content) {
    return null;
  }

  // Cas 2 : String simple (texte ou markdown)
  if (typeof content === 'string') {
    return (
      <div className={className}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  // Cas 3 : Array de blocs structurés (Strapi Blocks)
  if (Array.isArray(content)) {
    if (content.length === 0) {
      return null;
    }

    return (
      <div className={className}>
        {content.map((block, index) => {
          if (block.type === 'paragraph' && hasChildren(block)) {
            const children = block.children;

            return (
              <p key={index}>
                {children.map((child, childIndex) => {
                  let node: React.ReactNode = child.text;

                  if (child.underline) node = <u>{node}</u>;
                  if (child.italic) node = <em>{node}</em>;
                  if (child.bold) node = <strong>{node}</strong>;

                  return <span key={childIndex}>{node}</span>;
                })}
              </p>
            );
          }

          return null;
        })}
      </div>
    );
  }

  // Cas 4 : Objet inconnu, on essaie de l'afficher
  return (
    <div className={className}>
      <p>{String(content)}</p>
    </div>
  );
};

export default RichTextRenderer;