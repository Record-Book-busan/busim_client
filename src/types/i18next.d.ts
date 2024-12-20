import { defaultNS } from '@/translations'
import * as en from '@/translations/en'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: typeof en
  }
}
