export type Tag = {
  id: number
  user_id: number
  name: string,
  sign: string,
  kind: 'expenses' | 'income'
}

export type Item = {
  id: number
  user_id: number
  name: string,
  sign: string,
  kind: 'expenses' | 'income'
  amount: number,
  tags_id: Array<number>,
  isTouchMove: boolean | undefined,
  created_at: string,
  tags: Tag[]
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

export type Summary = {
  expenses: string,
  income: string,
  profit: string
}

export type User = {
  name: string,
  email: string
}