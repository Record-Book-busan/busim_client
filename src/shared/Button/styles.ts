import { cva } from 'class-variance-authority'

export const buttonContainerVariants = cva(
  'flex justify-center items-center rounded-xl transition-colors self-start',
  {
    variants: {
      type: {
        container: '',
        inner: '',
      },
      variant: {
        default: 'bg-white',
        primary: 'bg-BUSIM-blue',
        ghost: 'bg-transparent',
      },
      size: {
        sm: 'h-10 px-1',
        md: 'h-12 px-1.5',
        lg: 'h-[54px] px-10',
        full: 'h-[56px] px-6 w-full rounded-2xl',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    compoundVariants: [
      { variant: ['default', 'primary'], size: 'sm', type: 'container', class: 'px-3' },
      { variant: ['default', 'primary'], size: 'md', type: 'container', class: 'w-1/2' },
      { variant: ['default', 'primary'], size: 'lg', type: 'container', class: 'w-2/3' },
      { variant: ['default', 'primary'], size: 'full', type: 'container', class: '' },
    ],
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
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
