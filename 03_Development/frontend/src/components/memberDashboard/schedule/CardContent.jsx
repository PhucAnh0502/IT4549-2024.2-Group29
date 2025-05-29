import React from 'react';
import classNames from 'classnames';

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={classNames("p-2", className)} {...props}>
      {children}
    </div>
  );
};

export default CardContent;