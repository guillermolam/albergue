import { map } from 'nanostores';

export interface FormErrors {
  [field: string]: string[];
}

export interface FormState {
  errors: FormErrors;
  touched: { [field: string]: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

const DEFAULT_STATE: FormState = {
  errors: {},
  touched: {},
  isValid: true,
  isSubmitting: false,
  submitCount: 0,
};

export const formState = map<FormState>(DEFAULT_STATE);

export const formActions = {
  setFieldError(field: string, error: string | string[] | null) {
    const state = formState.get();
    const errors = { ...state.errors };
    if (error === null || (Array.isArray(error) && error.length === 0)) {
      delete errors[field];
    } else {
      errors[field] = Array.isArray(error) ? error : [error];
    }
    const isValid = Object.keys(errors).length === 0;
    formState.set({ ...state, errors, isValid });
  },

  clearFieldError(field: string) {
    formActions.setFieldError(field, null);
  },

  setTouched(field: string, touched = true) {
    const state = formState.get();
    formState.set({ ...state, touched: { ...state.touched, [field]: touched } });
  },

  validateAll(errors: FormErrors) {
    const state = formState.get();
    const isValid = Object.keys(errors).length === 0;
    formState.set({ ...state, errors, isValid });
  },

  resetValidation() {
    const state = formState.get();
    formState.set({ ...state, errors: {}, touched: {}, isValid: true });
  },

  startSubmit() {
    const state = formState.get();
    formState.set({ ...state, isSubmitting: true, submitCount: state.submitCount + 1 });
  },

  endSubmit(success: boolean, serverErrors?: FormErrors) {
    const state = formState.get();
    const updates: Partial<FormState> = { isSubmitting: false };
    if (!success && serverErrors) {
      updates.errors = serverErrors;
      updates.isValid = Object.keys(serverErrors).length === 0;
    }
    formState.set({ ...state, ...updates });
  },

  reset() {
    formState.set(DEFAULT_STATE);
  },
};

export default formState;
