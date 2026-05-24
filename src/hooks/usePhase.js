import { useContext } from 'react';
import { AppContext, PHASES } from '../context/AppContext';

export function usePhase() {
  const { state, dispatch } = useContext(AppContext);

  const advanceTo = (nextPhase) => {
    dispatch({ type: 'SET_PHASE', payload: nextPhase });
  };

  const nextPhaseMap = {
    [PHASES.INTRO]: PHASES.WONDER,
    [PHASES.WONDER]: PHASES.STORY,
    [PHASES.STORY]: PHASES.SIMULATE,
    [PHASES.SIMULATE]: PHASES.PLAY,
    [PHASES.PLAY]: PHASES.REFLECT,
    [PHASES.REFLECT]: PHASES.INTRO,
  };

  const advance = () => {
    if (nextPhaseMap[state.phase]) {
      advanceTo(nextPhaseMap[state.phase]);
    }
  };

  return {
    phase: state.phase,
    advanceTo,
    advance,
    PHASES,
    completedPhases: state.completedPhases,
  };
}
