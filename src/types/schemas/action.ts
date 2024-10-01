import { z } from 'zod'

import type { NativeActionRequest, NativeActionResponse, NativeActionType } from '../action'

export const requestPayloadSchema = {
  GET_CURRENT_LOCATION: z.object({
    lat: z.number(),
    lng: z.number(),
    visible: z.boolean().optional(),
  }),
  GET_PLACE_DATA: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      type: z.string().optional(),
      lat: z.number(),
      lng: z.number(),
    }),
  ),
  GET_RECORD_DATA: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      lat: z.number(),
      lng: z.number(),
      imageUrl: z.string(),
    }),
  ),
  GET_OVERLAY_STATE: z.boolean(),
} as const

export const responsePayloadSchema = {
  GET_CURRENT_LOCATION: z.object({ lng: z.number(), lat: z.number() }),
  GET_PLACE_DATA: z.object({}),
  GET_RECORD_DATA: z.object({}),
  GET_OVERLAY_STATE: z.object({}),
} as const

export type RequestPayload = {
  [K in keyof typeof requestPayloadSchema]: z.infer<(typeof requestPayloadSchema)[K]>
}

export type ResponsePayload = {
  [K in keyof typeof responsePayloadSchema]: z.infer<(typeof responsePayloadSchema)[K]>
}

const NATIVE_ACTION_TYPES = Object.keys(requestPayloadSchema) as NativeActionType[]

/**
 * 메시지가 `NativeActionRequest` 타입인지 확인합니다.
 * @param message - unknown
 * @return boolean
 */
export function isNativeActionRequest<T extends NativeActionType>(
  message: unknown,
): message is NativeActionRequest<T> {
  if (typeof message !== 'object' || message === null) return false
  const { id, action, payload } = message as NativeActionRequest<T>

  const isValidId = typeof id === 'string'
  const isValidAction = NATIVE_ACTION_TYPES.includes(action)

  if (!isValidId || !isValidAction) return false

  const schema = requestPayloadSchema[action]
  const isValidPayload = schema ? schema.safeParse(payload).success : false

  return isValidPayload
}

/**
 * 메시지가 `NativeActionResponse` 타입인지 확인합니다.
 * @param message - unknown
 * @return boolean
 */
export function isNativeActionResponse<T extends NativeActionType>(
  message: unknown,
): message is NativeActionResponse<T> {
  if (typeof message !== 'object' || message === null) return false
  const { id, status, action, payload } = message as NativeActionResponse<T>

  const isValidId = typeof id === 'string'
  const isValidStatus = status === 'SUCCESS' || status === 'ERROR'
  const isValidAction = NATIVE_ACTION_TYPES.includes(action)

  if (!isValidId || !isValidStatus || !isValidAction) return false

  const schema = responsePayloadSchema[action]
  const isValidPayload = schema ? schema.safeParse(payload).success : false

  return isValidPayload
}
