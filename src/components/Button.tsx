import React from 'react';

interface ButtonProps {
  /**
   * ボタンのテキスト
   */
  label: string;
  /**
   * クリック時のハンドラー
   */
  onClick?: () => void;
  /**
   * ボタンのバリアント
   */
  variant?: 'primary' | 'secondary' | 'danger';
  /**
   * ボタンのサイズ
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 無効化フラグ
   */
  disabled?: boolean;
}

/**
 * カスタマイズ可能なボタンコンポーネント
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
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

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
