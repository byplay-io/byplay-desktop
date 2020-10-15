import React from 'react';
import { selectIsSetUp } from '../features/setup';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import routes from '../constants/routes.json';

export default function Home(): JSX.Element {
  let isSetUp = useSelector(selectIsSetUp)

  if(!isSetUp) {
    return <Redirect to={routes.SETUP} push />
  }
  return <Redirect to={routes.RECORDINGS_LIST} push />
}
