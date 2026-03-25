import { atom, map } from 'nanostores';

export type UserSelections = {
  status: 'new' | 'existing' | '4wd' | 'searching' | null;
  vehicle: 'crafter' | 'sprinter' | 'other' | null;
  timeline: 'asap' | 'this_year' | 'next_year' | null;
  usage: 'holiday' | 'hybrid' | 'daily' | null;
  needs: 'sports' | 'storage' | 'sleep' | null;
  concern: 'value' | 'holes' | 'timeline' | null;
};

export const currentStep = atom<number>(0);
export const userSelections = map<UserSelections>({
  status: null,
  vehicle: null,
  timeline: null,
  usage: null,
  needs: null,
  concern: null,
});

export const nextStep = () => {
  currentStep.set(currentStep.get() + 1);
};

export const setStep = (step: number) => {
  currentStep.set(step);
};

export const setSelection = <K extends keyof UserSelections>(key: K, value: UserSelections[K]) => {
  userSelections.setKey(key, value);
};

export const resetQuiz = () => {
  currentStep.set(0);
  userSelections.set({
    status: null,
    vehicle: null,
    timeline: null,
    usage: null,
    needs: null,
    concern: null,
  });
};
