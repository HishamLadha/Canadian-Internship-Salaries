import React from 'react'

export default function SubmitLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
          {children}
        </div>
        
    );
  }
  