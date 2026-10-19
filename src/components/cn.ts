/**
 * falsy な値を除いてクラス名を半角スペースで連結する
 * (Tailwind の競合クラスの解決はしないため、上書きしたい場合は利用側で調整すること)
 */
export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');
