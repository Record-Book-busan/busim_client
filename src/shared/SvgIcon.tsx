import { type SvgProps } from 'react-native-svg'

import * as Icons from '@/assets/icons'

export type IconName = keyof typeof Icons

type IconProps = SvgProps & {
  name: IconName
  size?: number
}

function Icon({ name, width: _width, height: _height, size, ...props }: IconProps) {
  const Comp = Icons[name]
  const width = _width ?? size
  const height = _height ?? size
  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  return <Comp {...props} {...sizeProps} />
}

export default Icon
