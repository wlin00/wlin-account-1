export type Tag = {
  id: number
  user_id: number
  name: string,
  sign: string,
  king: 'expenses' | 'income'
}

export type Item = {
  id: number
  user_id: number
  name: string,
  sign: string,
  king: 'expenses' | 'income'
  amount: number,
  tags_id: Array<number>,
  isTouchMove: boolean | undefined,
  // "note": null,
}

export type Resources<T = any> = {
  resource: T[]
  pager: {
    page: number,
    per_page: number,
    count: number
  }
}

export type Resource<T = any> = {
  resource: T
}