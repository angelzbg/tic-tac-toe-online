import { useReducer } from 'react';

export const useAuthForm = (initFieldsArray = () => [], onSubmit = async () => {}) => {
  const [state, dispatch] = useReducer(
    (state, { type, payload }) => {
      switch (type) {
        case 'changeValue':
          const fields = [...state.fields];
          const errors = [...state.errors];
          const foundIndex = fields.findIndex(({ name }) => name === payload.name);
          errors[foundIndex] = false;
          fields[foundIndex].value = payload.value;
          return { ...state, fields, errors, networkError: '' };
        case 'setErrors':
          return { ...state, errors: payload.errors };
        case 'setNetworkError':
          return { ...state, networkError: payload.error };
        default:
          return state;
      }
    },
    {
      fields: initFieldsArray(),
      errors: [],
      networkError: '',
    }
  );

  const onChange = ({ target: { value, name } }) => dispatch({ type: 'changeValue', payload: { value, name } });

  const isValidForm = () => {
    const errors = [];
    state.fields.forEach((field, i) => {
      if (field?.valid?.regex && !field.value.match(field.valid.regex)) {
        errors[i] = true;
        return;
      }

      if (field?.valid?.field && state.fields.find(({ name }) => name === field.valid.field).value !== field.value) {
        errors[i] = true;
        return;
      }
    });

    dispatch({ type: 'setErrors', payload: { errors } });

    return !errors.find((error) => error);
  };

  const getFieldsBody = () => state.fields.reduce((acc, { name, value }) => Object.assign(acc, { [name]: value }), {});

  const setNetworkError = (error = '') => {
    dispatch({ type: 'setNetworkError', payload: { error } });
  };

  const submit = async () => {
    if (!isValidForm()) {
      return;
    }

    const response = await onSubmit(getFieldsBody());
    if (response.error) {
      setNetworkError(response.error);
    }
  };

  return { state, onChange, submit };
};
