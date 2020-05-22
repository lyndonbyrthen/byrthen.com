import { ActionType } from "../control/control";

export interface RootActionType extends ActionType {
    type: 'landing' | 'error' | '404' | string;
  }