export const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changPassword: '/user/password',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  payment: '/payment',
  paymentReturn: '/payment/vnpay_return'
} as const

export const PORT = 4000
