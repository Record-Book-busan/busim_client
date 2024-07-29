import { type SvgProps } from 'react-native-svg'

import * as Icons from '@/assets'

export type IconName = keyof typeof Icons

type IconProps = SvgProps & {
  name: IconName
  size?: number
  className?: string
}

function Icon({ name, className, width: _width, height: _height, size, ...props }: IconProps) {
  const Comp = Icons[name]
  const width = _width ?? size
  const height = _height ?? size
  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  return <Comp {...props} className={className} {...sizeProps} />
}

export default Icon
