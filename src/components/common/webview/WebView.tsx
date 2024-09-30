import { forwardRef, type RefObject, useRef } from 'react'
import {
  WebView as BaseWebView,
  type WebViewMessageEvent,
  type WebViewProps as BaseWebViewProps,
} from 'react-native-webview'

import { handleLog, INJECT_DEBUG, LogType } from './console'

interface WebViewProps extends BaseWebViewProps {
  debug?: boolean
}

export const WebView = forwardRef<BaseWebView, WebViewProps>((props, ref) => {
  const localRef = useRef<BaseWebView>(null)
  const webviewRef = (ref as RefObject<BaseWebView>) || localRef

  const handleMessage = (event: WebViewMessageEvent) => {
    if (!webviewRef.current) {
      return
    }
    const { type, data } = JSON.parse(event.nativeEvent.data)
    if (type === 'LOG') {
      const { method, args } = data as {
        method: LogType
        args: string
      }
      handleLog({ method, args })
    } else {
      props.onMessage?.(event)
    }
  }

  return (
    <BaseWebView
      {...props}
      ref={webviewRef}
      onMessage={handleMessage}
      injectedJavaScript={[props.debug && INJECT_DEBUG, props.injectedJavaScript, 'true;']
        .filter(Boolean)
        .join('\n')}
    />
  )
})

export type WebViewEl = BaseWebView
