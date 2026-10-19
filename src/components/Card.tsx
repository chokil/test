import React from 'react';
import { cn } from './cn';

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
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
   * 指定するとタイトルが button になり、その当たり判定がカード全体に広がる
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * カードの影の強さ
   */
  elevation?: 'low' | 'medium' | 'high';
}

const elevationStyles = {
  low: 'shadow-sm',
  medium: 'shadow-md',
  high: 'shadow-lg',
};

/**
 * 情報をまとめて表示するカードコンポーネント
 * ref と、className を含むネイティブ div の props はルート要素に渡される。children は説明文の下に描画される
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      description,
      imageUrl,
      footer,
      onClick,
      elevation = 'medium',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const clickableStyles = onClick
      ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300'
      : '';

    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'relative bg-white rounded-lg overflow-hidden',
          elevationStyles[elevation],
          clickableStyles,
          className,
        )}
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
            {onClick ? (
              // ::after をカード全体に広げ、カードのどこをクリックしてもこの button が反応するようにする
              <button
                type="button"
                onClick={onClick}
                className="text-left after:absolute after:inset-0 after:rounded-lg focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-blue-500"
              >
                {title}
              </button>
            ) : (
              title
            )}
          </h3>

          {description && (
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              {description}
            </p>
          )}

          {children}
        </div>

        {footer && (
          // relative z-10 で、カード全体に広がったタイトル button の当たり判定より前面に出す
          <div className="relative z-10 px-6 py-4 bg-gray-50 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
