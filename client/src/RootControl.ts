import { createControl } from './control/control';
import { reducer, RootStateType } from './reducer/reducer';
import { middleware } from './middleware/middleware';
import { RootActionType } from './actions/actions';

const { Control, useControlContext } = createControl<RootStateType, RootActionType>({
    initState: {
        appId: ''
    },
    reducer: reducer,
    middleware: middleware,
    displayName: 'RootContext'
});

export const RootControl = Control;

export const useRootContext = useControlContext;
