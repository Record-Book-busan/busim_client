type makePlacesProps = {
  id: number
  lat: number
  lng: number
  imageUrl: string
  category: string
}

type makePlacesReturn = {
  title: string
  type: string
  latlng: string
}

const makePlaces = (params: makePlacesProps[]) => {
  const places: makePlacesReturn[] = []

  params.map(p => {
    places.push({
      title: p.id.toString(),
      type: p.category,
      latlng: p.imageUrl,
    })
  })

  return places
}

export { makePlaces }
