import { MessageData } from './schemas/message'

export interface WebViewMessageMap {
  OVERLAY_CLICK: MessageData['OVERLAY_CLICK']
  ZOOM_CHANGE: MessageData['ZOOM_CHANGE']
  POSITION_CHANGE: MessageData['POSITION_CHANGE']
}

export type WebViewMessageType = keyof WebViewMessageMap

export type WebViewMessageData<T extends WebViewMessageType> = WebViewMessageMap[T]

export type WebViewMessage<T extends WebViewMessageType> = {
  type: T
  data: WebViewMessageData<T>
}
