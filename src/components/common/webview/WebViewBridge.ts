import { WebView } from 'react-native-webview'

import {
  NativeActionData,
  NativeActionRequest,
  NativeActionResponse,
  NativeActionType,
} from '@/types/action'
import { WebViewMessage, WebViewMessageData, WebViewMessageType } from '@/types/message'
import { isNativeActionResponse } from '@/types/schemas/action'
import { isWebViewMessage } from '@/types/schemas/message'

import type { WebViewMessageEvent } from 'react-native-webview'

export class WebViewBridge {
  private webviewRef: React.RefObject<WebView>
  private pendingRequests: Map<
    string,
    {
      resolve: (value: any) => void
      reject: (reason?: any) => void
      timeoutId: NodeJS.Timeout
    }
  > = new Map()

  private timeoutDuration: number = 5000

  private eventHandlers: Map<WebViewMessageType, (data: WebViewMessageData<any>) => void> =
    new Map()

  constructor(webviewRef: React.RefObject<WebView>) {
    this.webviewRef = webviewRef
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * WebView에 요청을 보냅니다.
   * @param action 요청 타입
   * @param payload 요청에 포함될 데이터
   */
  sendRequest<T extends NativeActionType>(
    action: T,
    payload: NativeActionData<T>['request'],
  ): Promise<NativeActionResponse<T>> {
    const requestId = this.generateRequestId()
    const message: NativeActionRequest<T> = {
      id: requestId,
      action,
      payload,
    }

    return new Promise((resolve, reject) => {
      // 요청에 대한 타임아웃을 설정합니다.
      const timeoutId = setTimeout(() => {
        // 타임아웃 발생 시 Promise를 거부합니다.
        this.pendingRequests.delete(requestId)
        reject(new Error(`요청 시간 초과: ${action}`))
      }, this.timeoutDuration)

      // resolve와 reject 함수를 저장합니다.
      this.pendingRequests.set(requestId, { resolve, reject, timeoutId })

      // 메시지를 WebView에 보냅니다.
      this.webviewRef.current?.postMessage(JSON.stringify(message))
    })
  }

  /**
   * 특정 이벤트 타입에 대한 이벤트 핸들러를 등록합니다.
   * @param type 이벤트 타입
   * @param handler 이벤트를 처리할 함수
   */
  onEvent<T extends WebViewMessageType>(
    type: T,
    handler: (data: WebViewMessageData<T>) => void,
  ): void {
    this.eventHandlers.set(type, handler)
  }

  /**
   * WebView에서 온 메시지를 처리합니다.
   * @param event WebView에서 온 메시지 이벤트
   */
  handleMessage = async (event: WebViewMessageEvent) => {
    const eventData = event.nativeEvent.data
    const message = await JSON.parse(eventData)

    if (isNativeActionResponse(message)) {
      // 이것은 WebView로부터의 응답입니다.
      this.handleResponse(message)
    } else if (isWebViewMessage(message)) {
      // 이것은 WebView로부터의 이벤트입니다.
      this.handleEvent(message)
    } else {
      console.warn('알 수 없는 메시지 형식:', message)
    }
  }

  // WebView로부터의 응답을 처리합니다.
  private handleResponse<T extends NativeActionType>(message: NativeActionResponse<T>): void {
    const pendingRequest = this.pendingRequests.get(message.id)
    if (pendingRequest) {
      clearTimeout(pendingRequest.timeoutId)
      this.pendingRequests.delete(message.id)
      if (message.status === 'SUCCESS') {
        pendingRequest.resolve(message)
      } else {
        pendingRequest.reject(new Error('요청 실패'))
      }
    } else {
      console.warn('응답에 대한 보류 중인 요청이 없습니다:', message.id)
    }
  }

  // WebView로부터의 이벤트를 처리합니다.
  private handleEvent<T extends WebViewMessageType>(message: WebViewMessage<T>): void {
    const { type, data } = message
    const handler = this.eventHandlers.get(type)
    if (handler) {
      handler(data)
    } else {
      console.warn('이벤트 핸들러가 등록되지 않음:', type)
    }
  }

  /**
   * 특정 이벤트 타입에 대한 이벤트 핸들러를 제거합니다.
   * @param type 이벤트 타입
   */
  offEvent(type: WebViewMessageType): void {
    this.eventHandlers.delete(type)
  }
}
