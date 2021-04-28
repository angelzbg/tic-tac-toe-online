const NETWORK_CODES = {
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  SUCCESS: 'SUCCESS',
};

const NETWORK_CODES_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
};

const NETWORK_CODES_TYPES_ARRAY = Object.values(NETWORK_CODES_TYPES);

const respond = (code, data) => {
  if (!NETWORK_CODES_TYPES_ARRAY.includes(code)) {
    throw new Error(`Invalid network code type provided [${NETWORK_CODE_TYPE}]`);
  }

  return { [NETWORK_CODE_TYPE]: data };
};

module.exports = { NETWORK_CODES, NETWORK_CODES_TYPES, respond };
