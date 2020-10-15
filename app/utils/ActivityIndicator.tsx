import React from 'react';
import Spinner from 'react-spinkit'
import { colors } from '../theme';

export default function ActivityIndicator() {
  return <Spinner name="wave" color={colors.bright} />
}
