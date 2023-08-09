import {configureStore, type Action, type Middleware} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';
import {type ThunkAction} from 'redux-thunk';
import thunkMiddleware from 'redux-thunk';
/// // eslint-disable-next-line import/no-cycle
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer();
export type RootState = ReturnType<typeof rootReducer>;

const middleware: Middleware[] = [thunkMiddleware];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
  process.env.NODE_ENV ?? '',
);

if (shouldIncludeLogger) {
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);
}

export const configuredStore = (initialState?: RootState) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
    preloadedState: initialState,
  });

export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type AppDispatch = Store['dispatch'];
