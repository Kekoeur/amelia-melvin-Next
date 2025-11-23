import React from 'react';
import { Paragraph } from '@/types/api';

interface RichTextRendererProps {
  content?: Paragraph[];
  className?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  console.log('RichTextRenderer content:', content);
  if (!content || !Array.isArray(content)) {
    return (<p className={className}>{content}</p>);
  };
  console.log('Rendering RichTextRenderer with content:', content);
  return (
    <div className={className}>
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index}>
              {block.children.map((child, childIndex) => {
                let text = child.text;
                
                // Gère le formatage
                if (child.bold) {
                  text = <strong key={childIndex}>{text}</strong> as any;
                } else if (child.italic) {
                  text = <em key={childIndex}>{text}</em> as any;
                } else if (child.underline) {
                  text = <u key={childIndex}>{text}</u> as any;
                }
                
                return <span key={childIndex}>{text}</span>;
              })}
            </p>
          );
        }
        
        // Gère d'autres types de blocs si besoin (heading, list, etc.)
        return null;
      })}
    </div>
  );
};

export default RichTextRenderer;