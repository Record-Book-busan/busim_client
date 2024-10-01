import { z } from 'zod'

import { WebViewMessage, WebViewMessageType } from '../message'

export type MessageData = {
  [K in keyof typeof requestDataSchema]: z.infer<(typeof requestDataSchema)[K]>
}

const requestDataSchema = {
  OVERLAY_CLICK: z.object({ id: z.string(), type: z.string() }),
  ZOOM_CHANGE: z.object({ zoomLevel: z.string() }),
  CENTER_CHANGE: z.object({ lat: z.number(), lng: z.number() }),
  POSITION_CHANGE: z.object({ lat: z.number(), lng: z.number() }),
  CONTENTS_LOADED: z.object({ loaded: z.boolean() }),
} as const

const MESSAGE_TYPES = Object.keys(requestDataSchema) as WebViewMessageType[]

/**
 * 메시지가 `WebViewMessage` 타입인지 확인합니다.
 * @param message - unknown
 * @returns boolean
 */
export function isWebViewMessage<T extends WebViewMessageType>(
  message: unknown,
): message is WebViewMessage<T> {
  if (typeof message !== 'object' || message === null) return false

  const { type, data } = message as WebViewMessage<T>
  const isMessageType = typeof type === 'string' && MESSAGE_TYPES.includes(type)

  const schema = requestDataSchema[type]
  const isValidData = schema ? schema.safeParse(data).success : false

  return isMessageType && isValidData
}
