import React from 'react';

export default function AuthenticatedPageContainer(props: {
  children: React.ReactNode;
}) {
  const {children} = props;
  return <div className="authorized-page-container w-full">{children}</div>;
}
