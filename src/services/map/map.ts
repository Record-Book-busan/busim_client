/**
 * 지도 생성 함수
 * @returns String
 */
function createMap() {
  return `
    const container = document.getElementById('map');
    const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    };
    
    map = new kakao.maps.Map(container, options)
  `
}

/**
 * 지도 중심 좌표 확인 함수
 */
function getMapCenter() {
  return `
    var level = map.getLevel();
    var latlng = map.getCenter();
  `
}

/**
 * 마커 초기화 함수
 */
function initMarkers() {
  return `
    showingMarkers.forEach(m => m.setMap(null))
    showingMarkers = []
  `
}

/**
 * 마커 보이게 하는 함수
 */
function showMarkers() {
  return `
    showingMarkers.forEach(m => {
        m.setMap(map)
    })
  `
}

/**
 * 마케 이미지 선택 함수
 * @param type string
 * @returns
 */
function getMarkerImage(type: string = 'food') {
  return `
    switch(${type}) {
        case 'food':
            return './marker_yellow.svg'
        case 'cafe':
            return './marker_purple.svg'
        default :
            return './marker_yellow.svg'
    }
  `
}

/**
 * 마커 생성 함수
 * @param type string
 */
function settingMarkers(type: string = 'food') {
  return `
    initMarkers()

    const data = [
        {
            title: '카카오', 
            type: 'food',
            latlng: new kakao.maps.LatLng(33.450705, 126.570677)
        },
        {
            title: '생태연못', 
            type: 'food',
            latlng: new kakao.maps.LatLng(33.450936, 126.569477)
        },
        {
            title: '텃밭', 
            type: 'cafe',
            latlng: new kakao.maps.LatLng(33.450879, 126.569940)
        },
        {
            title: '근린공원',
            type: 'food',
            latlng: new kakao.maps.LatLng(33.451393, 126.570738)
        }
    ]

    data.forEach((d) => {
        if(d.type === ${type}) {
            const markerImage = new kakao.maps.MarkerImage(getMarkerImage(d.type), new kakao.maps.Size(80, 80))

            const marker = new kakao.maps.Marker({
                position: d.latlng,
                title : d.title,
                image : markerImage 
            })

            showingMarkers.push(marker)
        }
    })

    showMarkers()
  `
}

/**
 * 지도에 등록할 함수를 적어주세요.
 * key: 함수명
 * val: String 타입의 함수 로직
 * isInit: 시작 함수 등록 여부
 */
const RegistFn = [
  {
    key: 'createMap()',
    val: createMap(),
    isInit: true,
  },
  {
    key: 'getMapCenter()',
    val: getMapCenter(),
    isInit: true,
  },
  {
    key: 'initMarkers()',
    val: initMarkers(),
    isInit: false,
  },
  {
    key: 'showMarkers()',
    val: showMarkers(),
    isInit: false,
  },
  {
    key: 'getMarkerImage(type)',
    val: getMarkerImage(),
    isInit: false,
  },
  {
    key: 'settingMarkers(type)',
    val: settingMarkers(),
    isInit: false,
  },
]

function js() {
  let registFn = ''
  let initFn = ''

  RegistFn.forEach(fn => {
    registFn += `function ${fn.key} { ${fn.val} }`

    if (fn.isInit) {
      initFn += `${fn.key};`
    }
  })

  if (initFn !== '') {
    initFn = `kakao.maps.load(function(){ ${initFn} })`
  }

  return { registFn, initFn }
}

const map = `
  <html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        process.env.KakaoJsApiKey
      }&libraries=services,clusterer,drawing"></script> 
  </head>
  <body >
      <div id="map" style="width: 100%; height: 100%;"></div>
      <script>
        let map;
        let showingMarkers = [];

        ${js().initFn}
        ${js().registFn}
      </script>
  </body>
  </html>
`

type detailProps = {
  lon: number
  lat: number
}

const detail = ({ lon, lat }: detailProps) => {
  return `
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
          process.env.KakaoJsApiKey
        }&libraries=services,clusterer,drawing"></script> 
    </head>
    <body >
        <div id="map" style="width: 100%; height: 100%;"></div>
        <script>
          let map;

          const container = document.getElementById('map');
          const options = {
              center: new kakao.maps.LatLng(${lon}, ${lat}),
              level: 3
          };
          
          map = new kakao.maps.Map(container, options)

          const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(${lon}, ${lat})
          });

          marker.setMap(map);
          map.setDraggable(false);
        </script>
    </body>
    </html>
  `
}

export { map, detail }
