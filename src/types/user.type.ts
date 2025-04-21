export type userData = {
  id: number
  email: string
  password: string
  first_name: string
  last_name: string
  phone: number
  created_at: Date
  refresh_token: string
  gender: 'm' | 'f' | 'o'
}

export type createUserData = {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: number
  created_at: Date
  refresh_token: string
  gender: 'm' | 'f' | 'o'
}
