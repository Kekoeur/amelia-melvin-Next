'use client';
import { ReactNode } from 'react';
import StyleProvider from '@/components/StyleProvider';
import { ComponentTypeChoixPoliceHtml } from '@/types/api';

interface ClientStyleWrapperProps {
  globalStyles: ComponentTypeChoixPoliceHtml[];
  pageStyles: ComponentTypeChoixPoliceHtml[];
  pageSlug: string;
  children: ReactNode;
}

export default function ClientStyleWrapper({
  globalStyles,
  pageStyles,
  pageSlug,
  children,
}: ClientStyleWrapperProps) {
  return (
    <>
      <StyleProvider
        globalStyles={globalStyles}
        pageStyles={pageStyles}
        pageSlug={pageSlug}
      />
      {children}
    </>
  );
}