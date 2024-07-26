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
    
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();
  `;
}

/**
 * 지도에 등록할 함수를 적어주세요.
 * key: 함수명
 * val: Strign 타입의 함수 로직
 * isInit: 시작 함수 등록 여부
 */
const RegistFn = [
  {
    key: "createMap",
    val: createMap(),
    isInit: true,
  },
];

function js() {
  let registFn = "";
  let initFn = "";

  RegistFn.forEach((fn) => {
    registFn += `function ${fn.key}() { ${fn.val} }`;

    if (fn.isInit) {
      initFn += `${fn.key}()`;
    }
  });

  if (initFn !== "") {
    initFn = `(function(){ ${initFn} })()`;
  }

  return { registFn, initFn };
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
        ${js().initFn}
        ${js().registFn}
      </script>
  </body>
  </html>
`;

export default map;
