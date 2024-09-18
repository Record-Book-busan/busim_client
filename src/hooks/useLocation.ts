import { useState, useEffect, useCallback } from 'react'
import Geolocation from 'react-native-geolocation-service'

import { useLocationToAddr } from '@/services/record'

import { useLocationPermission } from './useLocationPermission'

type Location = {
  lat: number
  lng: number
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location>({ lng: 129.16, lat: 35.1626 })
  const [tempLocation, setTempLication] = useState<Location>(location)
  const { permissionStatus, requestLocationAccess } = useLocationPermission()
  const { refetch } = useLocationToAddr(tempLocation.lat, tempLocation.lng)
  const [myPositionValid, setMyPositionValid] = useState<boolean>(false)

  const verifyLocation = useCallback(
    async (newLocation: Location) => {
      try {
        const { data } = await refetch()

        if (data?.documents[0]?.address.region_1depth_name.indexOf('부산') !== -1) {
          setLocation(newLocation)
          setMyPositionValid(true)
        } else {
          setMyPositionValid(false)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        console.log(`[ERROR]`)
      }
    },
    [refetch],
  )

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setTempLication({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })

        void verifyLocation(tempLocation)
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
