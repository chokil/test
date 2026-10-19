import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import DefaultButton from './Button';
import { Button as IndexButton, type ButtonProps } from './index';

describe('Button', () => {
  describe('レンダリング', () => {
    it('label をテキストとして表示し、role="button" で取得できる', () => {
      render(<Button label="送信" />);
      const button = screen.getByRole('button', { name: '送信' });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('default export も named export と同じコンポーネントである', () => {
      expect(DefaultButton).toBe(Button);
    });

    it('共通のベーススタイルが常に付与される', () => {
      render(<Button label="base" />);
      expect(screen.getByRole('button')).toHaveClass(
        'rounded',
        'font-semibold',
        'transition-colors',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
      );
    });

    it('デフォルトでは primary / medium / 有効状態で描画される', () => {
      render(<Button label="default" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'focus:ring-blue-500');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
      expect(button).toHaveClass('cursor-pointer');
      expect(button).not.toHaveClass('opacity-50', 'cursor-not-allowed');
      expect(button).toBeEnabled();
    });
  });

  describe('variant', () => {
    it.each([
      ['primary', ['bg-blue-600', 'hover:bg-blue-700', 'focus:ring-blue-500']],
      ['secondary', ['bg-gray-600', 'hover:bg-gray-700', 'focus:ring-gray-500']],
      ['danger', ['bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500']],
    ] as const)('variant="%s" のクラスが付与される', (variant, classes) => {
      render(<Button label="v" variant={variant} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(...classes);
      expect(button).toHaveClass('text-white');
    });

    it('他の variant のクラスは付与されない', () => {
      render(<Button label="v" variant="danger" />);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('bg-blue-600');
      expect(button).not.toHaveClass('bg-gray-600');
    });
  });

  describe('size', () => {
    it.each([
      ['small', ['px-3', 'py-1.5', 'text-sm']],
      ['medium', ['px-4', 'py-2', 'text-base']],
      ['large', ['px-6', 'py-3', 'text-lg']],
    ] as const)('size="%s" のクラスが付与される', (size, classes) => {
      render(<Button label="s" size={size} />);
      expect(screen.getByRole('button')).toHaveClass(...classes);
    });

    it('他の size のクラスは付与されない', () => {
      render(<Button label="s" size="small" />);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('px-4', 'text-base');
      expect(button).not.toHaveClass('px-6', 'text-lg');
    });
  });

  describe('onClick', () => {
    it('クリックで onClick が 1 回呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="click" onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('複数回クリックすると回数分呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="click" onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('キーボード (Enter / Space) でも onClick が呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="kb" onClick={handleClick} />);
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('onClick 未指定でもクリックでエラーにならない', async () => {
      const user = userEvent.setup();
      render(<Button label="no handler" />);
      await expect(user.click(screen.getByRole('button'))).resolves.toBeUndefined();
    });
  });

  describe('disabled', () => {
    it('disabled 属性が付き、無効状態として扱われる', () => {
      render(<Button label="off" disabled />);
      expect(screen.getByRole('button', { name: 'off' })).toBeDisabled();
    });

    it('disabled 時のスタイルが付与され、cursor-pointer は付与されない', () => {
      render(<Button label="off" disabled />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
      expect(button).not.toHaveClass('cursor-pointer');
    });

    it('disabled 時はクリックしても onClick が呼ばれない', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="off" disabled onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disabled 時はフォーカスできず、キーボード操作でも onClick が呼ばれない', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="off" disabled onClick={handleClick} />);
      await user.tab();
      expect(screen.getByRole('button')).not.toHaveFocus();
      await user.keyboard('{Enter}');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disabled={false} を明示すると有効状態になる', () => {
      render(<Button label="on" disabled={false} />);
      expect(screen.getByRole('button')).toBeEnabled();
    });

    it('disabled から有効に切り替えると onClick が呼ばれるようになる', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const { rerender } = render(<Button label="toggle" disabled onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();

      rerender(<Button label="toggle" disabled={false} onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('type', () => {
    it('既定では type="button" が付与される', () => {
      render(<Button label="t" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('<form> 内でクリックしてもフォームを送信しない', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button label="押す" />
        </form>,
      );
      await user.click(screen.getByRole('button'));
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('type="submit" を指定するとフォームを送信する', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button label="送信" type="submit" />
        </form>,
      );
      await user.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('index からの export', () => {
    it('index.ts から Button と ButtonProps 型を import できる', () => {
      const props: ButtonProps = { label: 'index' };
      render(<IndexButton {...props} />);
      expect(IndexButton).toBe(Button);
      expect(screen.getByRole('button', { name: 'index' })).toBeInTheDocument();
    });
  });

  describe('children / className / 追加 props / ref', () => {
    it('children を表示でき、label より優先される', () => {
      render(
        <Button label="label">
          <span>アイコン</span>保存
        </Button>,
      );
      expect(screen.getByRole('button', { name: 'アイコン 保存' })).toBeInTheDocument();
      expect(screen.queryByText('label')).not.toBeInTheDocument();
    });

    it('className を既存クラスとマージして付与できる', () => {
      render(<Button label="c" className="w-full mt-4" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full', 'mt-4', 'rounded', 'bg-blue-600', 'px-4');
    });

    it('aria-label / data-* などの追加 props が <button> に伝搬する', () => {
      render(<Button label="x" aria-label="閉じる" data-testid="close" id="close-btn" />);
      const button = screen.getByRole('button', { name: '閉じる' });
      expect(button).toHaveAttribute('data-testid', 'close');
      expect(button).toHaveAttribute('id', 'close-btn');
    });

    it('onClick にクリックイベントが渡される', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="e" onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
    });

    it('ref で <button> 要素を参照できる', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button label="r" ref={ref} />);
      expect(ref.current).toBe(screen.getByRole('button'));
    });
  });
});
