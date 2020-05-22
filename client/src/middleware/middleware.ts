
import { MiddlewareType } from '../control/control';
import { RootActionType } from '../actions/actions';
import { Dispatch } from 'react';
import { } from 'react-router-dom';

export function middleware(
  dispatch: Dispatch<RootActionType>,
  action: RootActionType
) {
  // console.log('middleware :: ', action.type, action.data);
  switch (action.type) {
    case 'on_navigate':
      break;
    default: break;
  }
}