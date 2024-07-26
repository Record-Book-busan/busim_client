import { styled, useColorScheme } from 'nativewind'
import { useMemo } from 'react'
import { Image, type ImageProps, type ImageSourcePropType } from 'react-native'

type ImageVariantProps = Omit<ImageProps, 'source'> & {
  source: ImageSourcePropType
  sourceDark?: ImageSourcePropType
  sourceLight?: ImageSourcePropType
  className?: string
}

const StyledImage = styled(Image)

function ImageVariant({
  source: defaultSource,
  sourceDark,
  sourceLight,
  className,
  ...props
}: ImageVariantProps) {
  const { colorScheme } = useColorScheme()

  const source = useMemo(() => {
    if (colorScheme === 'dark' && sourceDark) {
      return sourceDark
    }
    if (colorScheme === 'light' && sourceLight) {
      return sourceLight
    }
    return defaultSource
  }, [colorScheme, defaultSource, sourceDark, sourceLight])

  return <StyledImage testID="variant-image" source={source} className={className} {...props} />
}

export default ImageVariant
