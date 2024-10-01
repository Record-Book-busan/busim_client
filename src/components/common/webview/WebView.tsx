import { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  WebView as BaseWebView,
  type WebViewMessageEvent,
  type WebViewProps as BaseWebViewProps,
} from 'react-native-webview'

import { handleLog, INJECT_DEBUG, LogType } from './console'
import { WebViewBridge } from './WebViewBridge'

interface WebViewProps extends BaseWebViewProps {
  debug?: boolean
}

export interface WebViewHandles {
  bridge: WebViewBridge
}

export const WebView = forwardRef<WebViewHandles, WebViewProps>((props, ref) => {
  const webviewRef = useRef<BaseWebView>(null)
  const bridgeRef = useRef<WebViewBridge | null>(null)

  if (!bridgeRef.current) {
    bridgeRef.current = new WebViewBridge(webviewRef)
  }

  useImperativeHandle(ref, () => ({
    bridge: bridgeRef.current!,
  }))

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
      // Bridge의 handleMessage를 호출
      void bridgeRef.current?.handleMessage(event)
    }
  }

  return (
    <BaseWebView
      {...props}
      ref={webviewRef}
      onMessage={handleMessage}
      onLoad={bridgeRef.current.handleLoad}
      injectedJavaScript={[props.debug && INJECT_DEBUG, props.injectedJavaScript, 'true;']
        .filter(Boolean)
        .join('\n')}
    />
  )
})
