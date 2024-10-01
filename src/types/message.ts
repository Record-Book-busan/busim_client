import { MessageData } from './schemas/message'

export interface WebViewMessageMap {
  OVERLAY_CLICK: MessageData['OVERLAY_CLICK']
  DRAG_START: MessageData['DRAG_START']
  CENTER_CHANGE: MessageData['CENTER_CHANGE']
  CONTENTS_LOADED: MessageData['CONTENTS_LOADED']
}

export type WebViewMessageType = keyof WebViewMessageMap

export type WebViewMessageData<T extends WebViewMessageType> = WebViewMessageMap[T]

export type WebViewMessage<T extends WebViewMessageType> = {
  type: T
  data: WebViewMessageData<T>
}
