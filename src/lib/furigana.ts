
export function convertFurigana(input: string): string {
    return input.replace(/\[([^\]]+)\]\{([^\}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>')
  }
  