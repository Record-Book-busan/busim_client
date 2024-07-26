import { styled } from 'nativewind'
import React from 'react'
import { type SvgProps } from 'react-native-svg'

import * as IconsAssets from '@/assets'

export type IconName = keyof typeof IconsAssets

const Icons = (Object.entries(IconsAssets) as [IconName, React.ComponentType<SvgProps>][]).reduce(
  (acc, [key, Comp]) => {
    acc[key] = styled(Comp)
    return acc
  },
  {} as Record<IconName, React.ComponentType<SvgProps & { className?: string }>>,
)

type IconProps = SvgProps & {
  name: IconName
  size?: number
  className?: string
}

function Icon({
  name,
  className,
  fill = 'currentColor',
  width: _width,
  height: _height,
  size,
  ...props
}: IconProps) {
  const Comp = Icons[name]
  const width = _width ?? size
  const height = _height ?? size
  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  return <Comp className={className} fill={fill} {...sizeProps} {...props} />
}

export default Icon
