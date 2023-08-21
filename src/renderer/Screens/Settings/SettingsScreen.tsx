import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import React from 'react';
import {setEmptyAccessToken} from '../../state/auth';
import {AppRoute} from '../routes';
import {SelectRecordingDir} from '../../components/SelectRecordingDir';
import AuthenticatedPageContainer from '../../components/AuthenticatedPageContainer';
import Preferences from '../../backend/Preferences';

export default function SettingsScreen() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const signOut = async () => {
    dispatch(setEmptyAccessToken());
    await Preferences.setBatch({accessToken: null, recordingsDir: null});
    navigate(AppRoute.ONBOARDING_AUTHENTICATE);
  };
  return (
    <AuthenticatedPageContainer>
      <h1>Settings</h1>

      <h3>Change directory where recordings are downloaded</h3>
      <SelectRecordingDir />

      <button
        className="absolute bottom-10 left-[120px] py-5 px-10 border-red border-2 rounded-full font-bold text-red bg-red-muted-200 hover:bg-red-muted-400 hover:text-light1"
        onClick={signOut}
      >
        Sign Out
      </button>
    </AuthenticatedPageContainer>
  );
}
