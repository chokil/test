import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';
import DefaultCard from './Card';
import { Card as IndexCard, type CardProps } from './index';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Card', () => {
  describe('レンダリング', () => {
    it('title を見出し (h3) として表示し、role="heading" で取得できる', () => {
      render(<Card title="カードタイトル" />);
      const heading = screen.getByRole('heading', { level: 3, name: 'カードタイトル' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    it('default export も named export と同じコンポーネントである', () => {
      expect(DefaultCard).toBe(Card);
    });

    it('ルート要素に基本スタイルが付与される', () => {
      const { container } = render(<Card title="t" />);
      expect(getRoot(container)).toHaveClass('bg-white', 'rounded-lg', 'overflow-hidden');
    });

    it('title のみ指定時は画像・説明文・フッターを描画しない', () => {
      const { container } = render(<Card title="only title" />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(container.querySelector('p')).toBeNull();
      expect(container.querySelector('.border-t')).toBeNull();
    });
  });

  describe('description', () => {
    it('description を指定すると段落として表示される', () => {
      render(<Card title="t" description="説明文です" />);
      const desc = screen.getByText('説明文です');
      expect(desc.tagName).toBe('P');
    });

    it('description が空文字の場合は描画されない', () => {
      const { container } = render(<Card title="t" description="" />);
      expect(container.querySelector('p')).toBeNull();
    });
  });

  describe('imageUrl', () => {
    it('imageUrl を指定すると img が描画され、src と alt(= title) が設定される', () => {
      render(<Card title="画像カード" imageUrl="https://example.com/image.jpg" />);
      const img = screen.getByRole('img', { name: '画像カード' });
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(img).toHaveAttribute('alt', '画像カード');
    });

    it('imageUrl が空文字の場合は img を描画しない', () => {
      render(<Card title="t" imageUrl="" />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('画像は見出しより前に描画される', () => {
      render(<Card title="順序" imageUrl="https://example.com/a.png" />);
      const img = screen.getByRole('img');
      const heading = screen.getByRole('heading');
      expect(img.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe('footer', () => {
    it('文字列の footer を表示する', () => {
      render(<Card title="t" footer="フッター" />);
      expect(screen.getByText('フッター')).toBeInTheDocument();
    });

    it('ReactNode の footer を表示し、その中の要素も操作できる', async () => {
      const user = userEvent.setup();
      const handleFooterClick = jest.fn();
      render(
        <Card
          title="t"
          footer={<button onClick={handleFooterClick}>詳細</button>}
        />,
      );
      await user.click(screen.getByRole('button', { name: '詳細' }));
      expect(handleFooterClick).toHaveBeenCalledTimes(1);
    });

    it('footer は本文より後に描画される', () => {
      render(<Card title="見出し" footer={<span>foot</span>} />);
      const heading = screen.getByRole('heading');
      const footer = screen.getByText('foot');
      expect(heading.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe('elevation', () => {
    it('デフォルトは medium (shadow-md)', () => {
      const { container } = render(<Card title="t" />);
      expect(getRoot(container)).toHaveClass('shadow-md');
    });

    it.each([
      ['low', 'shadow-sm'],
      ['medium', 'shadow-md'],
      ['high', 'shadow-lg'],
    ] as const)('elevation="%s" で %s が付与される', (elevation, cls) => {
      const { container } = render(<Card title="t" elevation={elevation} />);
      const root = getRoot(container);
      expect(root).toHaveClass(cls);
      for (const other of ['shadow-sm', 'shadow-md', 'shadow-lg'].filter((c) => c !== cls)) {
        expect(root).not.toHaveClass(other);
      }
    });
  });

  describe('onClick', () => {
    it('onClick 指定時、タイトルが button として取得でき見出し構造も保たれる', () => {
      render(<Card title="クリックカード" onClick={() => {}} />);
      const button = screen.getByRole('button', { name: 'クリックカード' });
      expect(button).toHaveAttribute('type', 'button');
      expect(screen.getByRole('heading', { level: 3, name: 'クリックカード' })).toContainElement(button);
    });

    it('onClick 未指定時は button を描画しない', () => {
      render(<Card title="t" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('タイトルの button をクリックすると onClick が呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Card title="t" onClick={handleClick} />);
      await user.click(screen.getByRole('button', { name: 't' }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Tab でフォーカスでき、Enter / Space で onClick が呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Card title="kb" onClick={handleClick} />);
      await user.tab();
      expect(screen.getByRole('button', { name: 'kb' })).toHaveFocus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('当たり判定をカード全体に広げるため、ルートが relative で button が after:absolute を持つ', () => {
      // jsdom は ::after を描画しないため、クリック領域の広がりはクラスで確認する
      const { container } = render(<Card title="t" onClick={() => {}} />);
      expect(getRoot(container)).toHaveClass('relative');
      expect(screen.getByRole('button')).toHaveClass('after:absolute', 'after:inset-0');
    });

    it('onClick 指定時はクリック可能を示すスタイルが付与される', () => {
      const { container } = render(<Card title="t" onClick={() => {}} />);
      expect(getRoot(container)).toHaveClass(
        'cursor-pointer',
        'hover:shadow-xl',
        'transition-shadow',
        'duration-300',
      );
    });

    it('onClick 未指定時はクリック可能スタイルが付与されない', () => {
      const { container } = render(<Card title="t" />);
      expect(getRoot(container)).not.toHaveClass('cursor-pointer', 'hover:shadow-xl');
    });

    it('footer 内のボタンをクリックしてもカードの onClick は呼ばれない', async () => {
      const user = userEvent.setup();
      const handleCardClick = jest.fn();
      const handleFooterClick = jest.fn();
      render(
        <Card
          title="t"
          onClick={handleCardClick}
          footer={<button onClick={handleFooterClick}>アクション</button>}
        />,
      );
      await user.click(screen.getByRole('button', { name: 'アクション' }));
      expect(handleFooterClick).toHaveBeenCalledTimes(1);
      expect(handleCardClick).not.toHaveBeenCalled();
    });

    it('footer はタイトル button の当たり判定より前面 (relative z-10) に置かれる', () => {
      render(<Card title="t" onClick={() => {}} footer={<span>foot</span>} />);
      expect(screen.getByText('foot').parentElement).toHaveClass('relative', 'z-10');
    });
  });

  describe('index からの export', () => {
    it('index.ts から Card と CardProps 型を import できる', () => {
      const props: CardProps = { title: 'index' };
      render(<IndexCard {...props} />);
      expect(IndexCard).toBe(Card);
      expect(screen.getByRole('heading', { name: 'index' })).toBeInTheDocument();
    });
  });

  describe('children / className / 追加 props / ref', () => {
    it('children を説明文の後に描画できる', () => {
      render(
        <Card title="t" description="説明">
          <ul>
            <li>項目</li>
          </ul>
        </Card>,
      );
      const desc = screen.getByText('説明');
      const item = screen.getByRole('listitem');
      expect(desc.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('className を既存クラスとマージしてルート要素に付与できる', () => {
      const { container } = render(<Card title="t" className="max-w-sm" />);
      expect(getRoot(container)).toHaveClass('max-w-sm', 'relative', 'bg-white', 'shadow-md');
    });

    it('aria-* / data-* などの追加 props がルート要素に伝搬する', () => {
      const { container } = render(<Card title="t" aria-labelledby="x" data-testid="card" id="c1" />);
      const root = getRoot(container);
      expect(root).toHaveAttribute('aria-labelledby', 'x');
      expect(root).toHaveAttribute('data-testid', 'card');
      expect(root).toHaveAttribute('id', 'c1');
    });

    it('ref でルートの div 要素を参照できる', () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(<Card title="t" ref={ref} />);
      expect(ref.current).toBe(getRoot(container));
    });
  });
});
