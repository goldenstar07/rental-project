export const requestPending = state => {
  return `${state}_PENDING`;
};

export const requestSuccess = state => {
  return `${state}_SUCCESS`;
};

export const requestFailed = state => {
  return `${state}_FAILED`;
};
