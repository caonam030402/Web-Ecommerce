import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import PRODUCT_LIST_EN from 'src/locales/en/productList.json'
import PRODUCT_LIST_VI from 'src/locales/vi/productList.json'
import HEADER_EN from 'src/locales/en/header.json'
import HEADER_VI from 'src/locales/vi/header.json'
import PRODUCT_DETAIL_EN from 'src/locales/en/productDetail.json'
import PRODUCT_DETAIL_VI from 'src/locales/vi/productDetail.json'
import CART_VI from 'src/locales/vi/cart.json'
import CART_EN from 'src/locales/en/cart.json'
import USER_VI from 'src/locales/vi/user.json'
import USER_EN from 'src/locales/en/user.json'
import FOOTER_VI from 'src/locales/vi/footer.json'
import FOOTER_EN from 'src/locales/en/footer.json'
import PAYMENT_VI from 'src/locales/vi/payment.json'
import PAYMENT_EN from 'src/locales/en/payment.json'

export const getLanguageFromLS = () => localStorage.getItem('language')
export const setLanguageToLS = (language: string) => localStorage.setItem('language', language)

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    productList: PRODUCT_LIST_EN,
    header: HEADER_EN,
    productDetail: PRODUCT_DETAIL_EN,
    cart: CART_EN,
    user: USER_EN,
    footer: FOOTER_EN,
    payment: PAYMENT_EN
  },
  vi: {
    productList: PRODUCT_LIST_VI,
    header: HEADER_VI,
    productDetail: PRODUCT_DETAIL_VI,
    cart: CART_VI,
    user: USER_VI,
    footer: FOOTER_VI,
    payment: PAYMENT_VI
  }
} as const

export const defaultNS = 'product'

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['productList', 'header', 'product', 'productDetail', 'cart', 'user', 'footer', 'payment'],
  fallbackLng: 'vi',
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})
