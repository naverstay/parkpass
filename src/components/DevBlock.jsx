import React from 'react';
import { Link } from 'react-router-dom';

export const DevBlock = () => {
  return (
    <div className="dev-block">
      <Link to={'/survey'}>survey</Link>
      <Link to={'/rating'}>rating</Link>
    </div>
  );
};
