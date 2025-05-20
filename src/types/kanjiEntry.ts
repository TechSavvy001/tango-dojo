export type KanjiEntry = {
    kanji: string
    bedeutung: string
    ausspracheOn: string
    ausspracheKun: string
    erklaerung: string
    merksatz: string
    radikale: {
      name: string
      bedeutung: string
      erklaerung: string
    }[]
  }
  