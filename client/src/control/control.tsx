import React, { useCallback, createContext, useContext, useReducer, Dispatch, useEffect, useState, Reducer } from 'react';

export interface ControlContextType<ControlStateType, A extends ActionType> {
  dispatch: Dispatch<A>;
  state: ControlStateType;
  // effectQueue: EffectQueueType;
}

type CreateControlProps<ControlStateType, A extends ActionType> = {
  initState: ControlStateType;
  displayName?: string;
  reducer: Reducer<ControlContextType<ControlStateType, A>, A>;
  middleware?: MiddlewareType<A>;
}

export type MiddlewareType<A extends ActionType> = (
  dispatch: Dispatch<A>,
  action: A
) => void;

export type ActionType = {
  type: string;
  data?: any;
}

const connectMiddleware = <A extends ActionType>(
  _dispatch: Dispatch<A>,
  middleware?: MiddlewareType<A>
) => {
  const dispatch = (action: A) => {
    middleware && middleware(dispatch, action);
    _dispatch(action);
  };
  return dispatch;
};

export const createControl = <ControlStateType extends {}, A extends ActionType>(
  { initState, displayName, reducer, middleware }: CreateControlProps<ControlStateType, A>
) => {

  const initContext = {
    dispatch: () => {},
    state: initState,
    // effectQueue: []
  } as ControlContextType<ControlStateType, A>;

  const ControlContext = createContext<ControlContextType<ControlStateType, A>>(initContext);
  ControlContext.displayName = displayName || 'ControlContext';
  const ControlProvider = ControlContext.Provider;
  const ControlConsumer = ControlContext.Consumer;

  const useControlContext = () => useContext(ControlContext);

  const Control = ({ children }: { children: JSX.Element }) => {

    const [context, _dispatch] = useReducer(reducer, initContext);

    const dispatch = connectMiddleware(_dispatch, middleware);
  
    context.dispatch = dispatch;
    
    // useEffect(() => {
   
    //   processQueue(context);
    // }, [context, context.effectQueue]);
  
    return <ControlProvider value={context}>{children}</ControlProvider>;
  };

  return { Control, ControlContext, ControlConsumer, useControlContext};
}

export const useControl = () => {

}
