import { Fragment } from 'react';

const AuthFields = ({ inputs, errors, onChange }) =>
  inputs.map(({ name, value, type, placeholder, errorMsg, properties }, idx) => (
    <Fragment key={name}>
      <div className={`auth-input ${errors[idx] ? 'error' : ''}`}>
        <input {...{ name, value, type, placeholder, onChange, ...properties }} />
        <div className={`error-box`}>{errorMsg}</div>
      </div>
      <br />
    </Fragment>
  ));

export default AuthFields;
