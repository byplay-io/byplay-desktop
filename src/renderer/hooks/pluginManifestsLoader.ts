import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import PluginRegistry from '../backend/PluginRegistry';
import {setPluginManifests} from '../state/plugins';

export function usePluginManifestsLoader() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loaded) {
      return;
    }
    setLoaded(true);

    PluginRegistry.getManifests()
      .then((manifests) => dispatch(setPluginManifests(manifests)))
      .catch(console.error);
  }, [dispatch, loaded]);
}
