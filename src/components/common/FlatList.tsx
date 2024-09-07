import React, { useRef, useState } from 'react'
import {
  View,
  Animated,
  type FlatListProps as FlatListBaseProps,
  type StyleProp,
  type ViewStyle,
  LayoutChangeEvent,
} from 'react-native'

import { window } from '@/constants'

type FlatListProps<T> = Omit<FlatListBaseProps<T>, 'ListHeaderComponent'> & {
  /**
   * An element that is above all
   *
   * Hides when scrolling
   */
  HeaderComponent: JSX.Element
  /**
   * An element that is above the list but lower than {@link Props.HeaderComponent HeaderComponent} and has the property sticky
   *
   * When scrolling is fixed on top
   */
  StickyElementComponent: JSX.Element
  /**
   * An element that is higher than the list but lower than {@link Props.HeaderComponent HeaderComponent} and {@link Props.StickyElementComponent StickyElementComponent}
   *
   * Hides when scrolling
   */
  TopListElementComponent?: JSX.Element
}

export function FlatList<T>({ style, ...props }: FlatListProps<T>): React.ReactElement {
  const [scrollY, styles, onLayoutHeaderElement, onLayoutTopListElement, onLayoutStickyElement] =
    useFlatListHook()

  return (
    <View style={style}>
      <Animated.View // <-- Sticky Component
        style={styles.stickyElement}
        onLayout={onLayoutStickyElement}
      >
        {props.StickyElementComponent}
      </Animated.View>

      {props.TopListElementComponent && (
        <Animated.View // <-- Top of List Component
          style={styles.topElement}
          onLayout={onLayoutTopListElement}
        >
          {props.TopListElementComponent}
        </Animated.View>
      )}

      <Animated.FlatList<any>
        {...props}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          // <-- Header Component
          <Animated.View onLayout={onLayoutHeaderElement}>{props.HeaderComponent}</Animated.View>
        }
        ListHeaderComponentStyle={[props.ListHeaderComponentStyle, styles.header]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      />
    </View>
  )
}

type IFlatListStyles = {
  header: StyleProp<ViewStyle>
  stickyElement: StyleProp<ViewStyle>
  topElement?: StyleProp<ViewStyle>
}

type TUseFlatListHook = [
  Animated.Value,
  IFlatListStyles,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void,
]

export const useFlatListHook = (): TUseFlatListHook => {
  const scrollY = useRef(new Animated.Value(0)).current
  const [heights, setHeights] = useState({
    header: 0,
    sticky: 0,
    topList: 0,
  })

  const styles: IFlatListStyles = {
    header: {
      marginBottom: heights.sticky + heights.topList, // <-- In order for the list to be under other elements
    },
    stickyElement: {
      left: 0,
      marginTop: heights.header, // <-- In order for the list to be under Header
      position: 'absolute',
      right: 0,
      transform: [
        {
          translateY: scrollY.interpolate({
            // <-- To move an element according to the scroll position
            extrapolate: 'clamp',
            inputRange: [-window.height, heights.header],
            outputRange: [window.height, -heights.header],
          }),
        },
      ],
      zIndex: 2,
    },
    topElement: {
      left: 0,
      marginTop: heights.header + heights.sticky, // <-- In order for the list to be under other elements
      position: 'absolute',
      right: 0,
      transform: [
        {
          translateY: scrollY.interpolate({
            // <-- To move an element according to the scroll position
            extrapolate: 'clamp',
            inputRange: [-window.height, heights.header + heights.sticky + heights.topList],
            outputRange: [window.height, -(heights.header + heights.sticky + heights.topList)],
          }),
        },
      ],
      zIndex: 1,
    },
  }

  const onLayoutHeaderElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, header: event.nativeEvent.layout.height })
  }

  const onLayoutTopListElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, topList: event.nativeEvent.layout.height })
  }

  const onLayoutTopStickyElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, sticky: event.nativeEvent.layout.height })
  }

  return [scrollY, styles, onLayoutHeaderElement, onLayoutTopListElement, onLayoutTopStickyElement]
}
