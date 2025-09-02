// route for location check
import { type Location } from 'react-router-dom';

export interface LocationState {
  from?: {
    pathname: string;
  };
}

export type LocationWithState = Location & {
  state?: LocationState;
};