import Toast, { type ToastShowParams } from 'react-native-toast-message'

type ToastType = 'notice' | 'info'

interface showToastProps extends ToastShowParams {
  text: string
  type?: ToastType
}

export const showToast = ({ text, type, ...props }: showToastProps) => {
  Toast.show({
    type: type ?? 'info',
    text1: text,
    position: props.position ?? 'bottom',
    visibilityTime: props.visibilityTime ?? 1750,
    topOffset: props.topOffset ?? 50,
    bottomOffset: props.bottomOffset ?? 50,
    ...props,
  })
}
