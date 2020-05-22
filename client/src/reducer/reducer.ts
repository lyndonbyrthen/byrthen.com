import { ControlContextType } from '../control/control';
import { RootActionType } from '../actions/actions';

export type RootStateType = {
  appId:string;
}

export function reducer(
  context: ControlContextType<RootStateType, RootActionType>, 
  action: RootActionType
): ControlContextType<RootStateType, RootActionType> {

  // console.log('reduers :: ',action.type, action.data);

  switch (action.type) {
    case 'on_navigate':
      const { path, history } = action.data;
      const location = {
        pathname: `/${path}`,
        state: { fromDashboard: true },
      };
      history.push(location);
      history.replace(location);
      return {...context, state: { ...context.state, appId:path}};
    case '404':
      return context;
    case 'error':
      return context;
    default: return context;
  }
}
