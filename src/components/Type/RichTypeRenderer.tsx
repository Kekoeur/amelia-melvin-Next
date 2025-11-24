'use client';
import React from 'react';
import { Paragraph } from '@/types/api';

interface RichTextRendererProps {
  content?: Paragraph[];
  className?: string;
}

type RichChild = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

// --------- Type guard sans any ---------
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
  if (!content || !Array.isArray(content) || content.length === 0) {
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
};

export default RichTextRenderer;
