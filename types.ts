export enum ValveMode {
  COOLING = 'COOLING',
  HEATING = 'HEATING'
}

export type ValveFault = 'NONE' | 'COIL_BURN' | 'VALVE_STUCK';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface ComponentProps {
  className?: string;
}

export interface ValveStateProps {
  mode: ValveMode;
}