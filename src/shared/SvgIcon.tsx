import { type SvgProps } from 'react-native-svg'

import * as Icons from '@/assets/icons'

import type { StyleProp, TextStyle } from 'react-native'

export type IconName = keyof typeof Icons

type IconProps = SvgProps & {
  /** 아이콘 이름 */
  name: IconName
  /** 아이콘 크기 */
  size?: number
  /** 스타일 직접 적용할 때 사용 */
  style?: StyleProp<TextStyle>
}

export function SvgIcon({
  name,
  width: _width,
  height: _height,
  size,
  style,
  ...props
}: IconProps) {
  const Comp = Icons[name]
  const width = _width ?? size
  const height = _height ?? size
  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  return <Comp {...sizeProps} {...props} style={style} />
}
