import React from 'react';
import PropTypes from 'prop-types';
import styles from './{ComponentName}.module.scss';

/**
 * {description}
 * 
 * @param {Object} props - Component props
 * @param {('primary'|'secondary'|'tertiary')} [props.variant='primary'] - Visual variant
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Component size
 * @param {React.ReactNode} [props.children] - Component content
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles
 */
export function {ComponentName}({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  style,
  ...rest
}) {
  const classNames = [
    styles.{componentName},
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div 
      className={classNames}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

{ComponentName}.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

{ComponentName}.defaultProps = {
  variant: 'primary',
  size: 'md',
  className: '',
};

export default {ComponentName};
