import React from 'react';
import classNames from 'classnames';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        "rounded-2xl border bg-white p-4 shadow-md transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;