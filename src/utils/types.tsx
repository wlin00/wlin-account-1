export type Tag = {
  id: number
  user_id: number
  name: string,
  sign: string,
  king: 'expenses' | 'income'
}

export type Resources<T = any> = {
  resource: T[]
  pager: {
    page: number,
    per_page: number,
    count: number
  }
}