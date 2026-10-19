import React from 'react';
import { cn } from './cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ボタンのテキスト(children を指定した場合は children が優先される)
   */
  label?: React.ReactNode;
  /**
   * ボタンのバリアント
   */
  variant?: 'primary' | 'secondary' | 'danger';
  /**
   * ボタンのサイズ
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * ボタンの type 属性(フォーム内での意図しない送信を防ぐため既定は 'button')
   */
  type?: 'button' | 'submit' | 'reset';
}

const baseStyles = 'rounded font-semibold transition-colors duration-200 focus:outline-none focus:ring-2';

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeStyles = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
};

/**
 * カスタマイズ可能なボタンコンポーネント
 * ref と、className を含むネイティブ button の props をそのまま受け付ける
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      children,
      onClick,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      type = 'button',
      className,
      ...rest
    },
    ref,
  ) => {
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], disabledStyles, className)}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {children ?? label}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
