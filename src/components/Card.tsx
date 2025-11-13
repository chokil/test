import React from 'react';

interface CardProps {
  /**
   * カードのタイトル
   */
  title: string;
  /**
   * カードの説明文
   */
  description?: string;
  /**
   * カード内に表示する画像URL
   */
  imageUrl?: string;
  /**
   * カードのフッターコンテンツ
   */
  footer?: React.ReactNode;
  /**
   * カード全体のクリックハンドラー
   */
  onClick?: () => void;
  /**
   * カードの影の強さ
   */
  elevation?: 'low' | 'medium' | 'high';
}

/**
 * 情報をまとめて表示するカードコンポーネント
 */
export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  footer,
  onClick,
  elevation = 'medium',
}) => {
  const elevationStyles = {
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
  };

  const clickableStyles = onClick
    ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300'
    : '';

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden ${elevationStyles[elevation]} ${clickableStyles}`}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-gray-600 text-base leading-relaxed mb-4">
            {description}
          </p>
        )}
      </div>

      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
