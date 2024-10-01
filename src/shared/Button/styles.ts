import { cva } from 'class-variance-authority'

export const buttonContainerVariants = cva(
  'flex justify-center items-center rounded-xl transition-colors self-start',
  {
    variants: {
      /** 버튼 유형 */
      type: {
        button: '', // 버튼 컨테이너 자체에 애니메이션
        text: '', // 버튼 텍스트에 애니메이션
        touch: '', // 터치 애니메이션
      },
      /** 버튼 색상 */
      variant: {
        default: 'bg-white',
        primary: 'bg-BUSIM-blue',
        ghost: 'bg-transparent',
      },
      size: {
        sm: 'px-1',
        md: 'px-1.5',
        lg: 'px-10',
        full: 'h-[54px] px-6 w-full rounded-2xl',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    compoundVariants: [
      /** 버튼 컨테이너 스타일 */
      { variant: ['default', 'primary'], size: 'sm', type: 'button', class: 'h-10 px-3' },
      { variant: ['default'], size: 'md', type: 'button', class: 'h-12 px-2 ' },
      { variant: ['default'], size: 'lg', type: 'button', class: 'h-[54px] w-2/3' },
      { variant: ['default'], size: 'full', type: 'button', class: '' },
      { variant: ['primary'], size: 'full', type: 'button', class: 'rounded-full' },
      { variant: ['primary'], size: 'lg', type: 'button', class: 'h-12 w-full px-4 rounded-full' },
      /** 텍스트 버튼 스타일 */
      { variant: 'ghost', size: 'md', type: 'text', class: 'h-11 px-1.5' },
      /** 터치 버튼 스타일 */
      { variant: 'ghost', size: 'md', type: 'touch', class: 'px-2 py-2 rounded-xl' },
    ],
  },
)

export const buttonTextVariants = cva('', {
  variants: {
    variant: {
      default: 'text-gray-700',
      primary: 'text-white',
      ghost: 'text-gray-600',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-base',
      full: 'text-base font-semibold',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      size: 'sm',
      class: 'font-normal',
    },
    {
      variant: 'default',
      size: ['md', 'lg', 'full'],
      class: 'font-medium',
    },
    {
      variant: 'ghost',
      size: ['md'],
      class: 'w-full flex-row items-center justify-between',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})
