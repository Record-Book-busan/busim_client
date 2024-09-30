import { RequestPayload, ResponsePayload } from './schemas/action'

export interface NativeActionMap {
  GET_CURRENT_LOCATION: {
    request: RequestPayload['GET_CURRENT_LOCATION']
    response: ResponsePayload['GET_CURRENT_LOCATION']
  }
  GET_PLACE_DATA: {
    request: RequestPayload['GET_PLACE_DATA']
    response: ResponsePayload['GET_PLACE_DATA']
  }
  GET_RECORD_DATA: {
    request: RequestPayload['GET_RECORD_DATA']
    response: ResponsePayload['GET_RECORD_DATA']
  }
  GET_OVERLAY_STATE: {
    request: RequestPayload['GET_OVERLAY_STATE']
    response: ResponsePayload['GET_OVERLAY_STATE']
  }
}

export type NativeActionType = keyof NativeActionMap

export type NativeActionData<T extends NativeActionType> = NativeActionMap[T]

export type NativeActionRequest<T extends NativeActionType> = {
  id: string
  action: T
  payload: NativeActionData<T>['request']
}

export type NativeActionResponse<T extends NativeActionType> = {
  id: string
  status: 'SUCCESS' | 'ERROR'
  action: T
  payload: NativeActionData<T>['response']
}
