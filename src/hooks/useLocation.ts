import { useState, useEffect } from 'react'
import Geolocation from 'react-native-geolocation-service'

import { useLocationToAddr } from '@/services/record'

import { useLocationPermission } from './useLocationPermission'

type Location = {
  lat: number
  lng: number
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location>({ lng: 129.16, lat: 35.1626 })
  const [tempLocation, setTempLocation] = useState<Location>(location)
  const { permissionStatus, requestLocationAccess } = useLocationPermission()
  const { refetch } = useLocationToAddr(tempLocation.lat, tempLocation.lng)
  const [myPositionValid, setMyPositionValid] = useState<boolean>(false)

  useEffect(() => {
    const verifyLocation = async () => {
      try {
        const { data } = await refetch()

        if (data?.documents[0]?.address.region_1depth_name.indexOf('부산') !== -1) {
          setLocation({
            lat: tempLocation.lat,
            lng: tempLocation.lng,
          })

          setMyPositionValid(true)
        } else {
          setMyPositionValid(false)
        }
      } catch (err: any) {
        console.log(`error: ${err}`)
      }
    }

    verifyLocation()
  }, [tempLocation])

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setTempLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      error => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }

  useEffect(() => {
    if (permissionStatus === 'granted') {
      getCurrentLocation()
    }
  }, [permissionStatus])

  const refreshLocation = async () => {
    const status = await requestLocationAccess()
    if (status === 'granted') {
      getCurrentLocation()
    }
  }

  return { location, myPositionValid, refreshLocation }
}
