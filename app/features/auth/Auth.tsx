import React from 'react';
import TmpSignInCode from './TmpSignInCode';
import { PageContent } from '../../containers/PageContent';

export default function Auth() {
  return <PageContent title={"Sign in with Byplay Camera"}>
    <TmpSignInCode />
  </PageContent>
}
