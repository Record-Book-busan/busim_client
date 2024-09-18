/* eslint-disable no-useless-escape */
const map = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- 스타일 시트 추가 -->
    <style>
      .group-overlay {
        position: relative;
        bottom: 40px;
        background: #00339D;
        border-radius: 20px 20px 20px 0;
        padding-inline: 8px;
        padding-block: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        pointer-events: auto;
      }
      .group-overlay .icons {
        position: relative;
        display: flex;
        align-items: center;
        pointer-events: none;
      }
      .group-overlay .count {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        color: black;
        font-size: 13px;
        margin-left: 10px;
      }
      .group-overlay .arrow {
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 0;
        height: 0;
        border-top: 10px solid #00339D;
        border-right: 10px solid transparent;
      }
      .group-overlay .icon {
        width: 30px;
        height: 30px;
        position: absolute;
      }
      .single-overlay {
        position: relative;
        border-radius: 50%;
        border: 0.75px solid white;
        box-shadow: 0 0px 3px rgba(0,0,0,0.1);
        pointer-events: auto;
      }
      .single-overlay .icons {
        position: relative;
        display: flex;
        align-items: center;
        pointer-events: none;
      }
      .single-overlay .icon {
        width: 22px;
        height: 22px;
      }
    </style>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      process.env.KakaoJsApiKey
    }&libraries=services,clusterer,drawing"></script>
</head>
<body style="margin: 0; padding: 0;">
    <div id="map" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>
    <script>
    let showingOverlays = []
    let infowindows = []
    let map

    /**
     * 지도 생성 함수
     */
    function createMap({ lat, lng }) {
        const container = document.getElementById('map');

        const options = {
            center: new kakao.maps.LatLng(lat, lng),
            maxLevel: 10,
        };

        map = new kakao.maps.Map(container, options);

        kakao.maps.event.addListener(map, 'zoom_changed', function(event) {
            const data = 'LEVEL_' + map.getLevel();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'zoomChanged', data: { zoomLevel: data } }));
        });

        kakao.maps.event.addListener(map, 'dragend', function() {
            const data = map.getCenter();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dragend', data: { lat: data.getLat(), lng: data.getLng() } }));
        });

        kakao.maps.event.addListener(map, 'click', initInfowindows);
        kakao.maps.event.addListener(map, 'bounds_changed', initInfowindows);
    }

    /**
     * 지도 이동 함수
     */
    function moveMap({ lng, lat, level=3 }) {
        const latlng = new kakao.maps.LatLng(lat, lng)

        map.setLevel(level)
        map.panTo(latlng)
    }

    /**
     * 마커 초기화 함수
     */
    function initMarkers() {
      if(markers && markers.length > 0) {
        markers.forEach(m => m.setMap(null))
        markers = []
      }
    }

    /**
     * 오버레이 초기화 함수
     */
    function initOverlays() {
      initInfowindows()

      if(showingOverlays && showingOverlays.length > 0) {
          showingOverlays.forEach(m => m.setMap(null))
          showingOverlays = []
      }
    }

    /**
     * 오버레이 제거 함수
     */
    function removeOverlays() {
        initOverlays();
    }

    /**
     * 클러스터 키 가져오기
     */
    function getClusterKey(position) {
        const level = map.getLevel();
        let gridSize;
        if (level <= 3) {
            gridSize = 50;
        } else if (level <= 7) {
            gridSize = 100;
        } else {
            gridSize = 150;
        }

        const projection = map.getProjection();
        const point = projection.pointFromCoords(position);
        const x = Math.floor(point.x / gridSize);
        const y = Math.floor(point.y / gridSize);

        return x + ',' + y;
    }

    /**
     * 오버레이 높이 조절
     */
    function getAnchorY(level) {
        return 0.5
    }

    /**
     * 인포 윈도우 초기화 함수
     */
    function initInfowindows() {
        if(infowindows && infowindows.length > 0) {
            infowindows.forEach(m => m.setMap(null))
            infowindows = []
        }
    }

    /**
     * 인포 윈도우 추가 함수
     */
    function showInfowindows() {
        infowindows.forEach(m => {
            m.setMap(map)
        })
    }

    /**
     * 인포 윈도우 클릭 함수
     */
    function handleInfowindowClick(id, type) {
        if(type === 'RECORD') type = 'record'
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'overlayClick', data: { type: type, id: id } }));
    }


      /**
       * 오버레이 이미지 선택 함수
       */
      function getOverlayImage(category) {
        const record = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIyIiBoZWlnaHQ9IjIyIiByeD0iMTEiIGZpbGw9IiNGRjdENDUiLz4KPHBhdGggZD0iTTE2IDE0Ljg4ODlWNy4xMTExMUMxNiA2LjUgMTUuNSA2IDE0Ljg4ODkgNkg3LjExMTExQzYuNSA2IDYgNi41IDYgNy4xMTExMVYxNC44ODg5QzYgMTUuNSA2LjUgMTYgNy4xMTExMSAxNkgxNC44ODg5QzE1LjUgMTYgMTYgMTUuNSAxNiAxNC44ODg5Wk05LjI3Nzc4IDEyLjFMMTAuNDQ0NCAxMy41MDU2TDEyLjE2NjcgMTEuMjg4OUMxMi4yNzc4IDExLjE0NDQgMTIuNSAxMS4xNDQ0IDEyLjYxMTEgMTEuMjk0NEwxNC41NjExIDEzLjg5NDRDMTQuNTkyMSAxMy45MzU3IDE0LjYxMDkgMTMuOTg0OCAxNC42MTU1IDE0LjAzNjJDMTQuNjIwMiAxNC4wODc1IDE0LjYxMDQgMTQuMTM5MiAxNC41ODczIDE0LjE4NTNDMTQuNTY0MyAxNC4yMzE1IDE0LjUyODggMTQuMjcwMyAxNC40ODQ5IDE0LjI5NzRDMTQuNDQxIDE0LjMyNDUgMTQuMzkwNSAxNC4zMzg5IDE0LjMzODkgMTQuMzM4OUg3LjY3Nzc4QzcuNDQ0NDQgMTQuMzM4OSA3LjMxNjY3IDE0LjA3MjIgNy40NjExMSAxMy44ODg5TDguODQ0NDQgMTIuMTExMUM4Ljk1IDExLjk2NjcgOS4xNjExMSAxMS45NjExIDkuMjc3NzggMTIuMVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='
          const food = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjODE2RTY4Ii8+DQo8cGF0aCBkPSJNNS40NjE0MiA5LjE2MjE5VjkuMTUzODlDNS40NjE0IDguMzMzMzMgNS43MDQ0MiA3LjUzMTE1IDYuMTU5ODEgNi44NDg1NkM2LjYxNTIgNi4xNjU5NiA3LjI2MjU2IDUuNjMzNTQgOC4wMjAyMSA1LjMxODQ1QzguNzc3ODYgNS4wMDMzNiA5LjYxMTg2IDQuOTE5NzMgMTAuNDE3IDUuMDc4MTFDMTEuMjIyMSA1LjIzNjQ5IDExLjk2MjMgNS42Mjk3OCAxMi41NDQxIDYuMjA4MzZDMTMuMDAyIDUuOTgyNDEgMTMuNTEzMyA1Ljg4NzQgMTQuMDIxNyA1LjkzMzg1QzE0LjUzMDEgNS45ODAyOSAxNS4wMTU4IDYuMTY2MzggMTUuNDI1MSA2LjQ3MTU1QzE1LjgzNDQgNi43NzY3MiAxNi4xNTEzIDcuMTg5MSAxNi4zNDA5IDcuNjYzMTFDMTYuNTMwNSA4LjEzNzEzIDE2LjU4NTQgOC42NTQzMyAxNi40OTk1IDkuMTU3NThDMTYuNjI1OCA5LjE2OTMgMTYuNzQ4NCA5LjIwNjkzIDE2Ljg1OTUgOS4yNjgxMkMxNi45NzA2IDkuMzI5MzEgMTcuMDY3OSA5LjQxMjc1IDE3LjE0NTMgOS41MTMyMkMxNy4yMjI4IDkuNjEzNyAxNy4yNzg3IDkuNzI5MDUgMTcuMzA5NSA5Ljg1MjA5QzE3LjM0MDQgOS45NzUxMyAxNy4zNDU2IDEwLjEwMzIgMTcuMzI0NyAxMC4yMjgzQzE2LjkwNzUgMTIuNzM4MiAxNS44NzU1IDE0LjMyNjggMTQuMjMwNiAxNC45OTUxVjE1LjYxNTRDMTQuMjMwNiAxNS45ODI2IDE0LjA4NDcgMTYuMzM0OCAxMy44MjUxIDE2LjU5NDVDMTMuNTY1NCAxNi44NTQxIDEzLjIxMzIgMTcgMTIuODQ2IDE3SDkuMTUzN0M4Ljc4NjQ4IDE3IDguNDM0MyAxNi44NTQxIDguMTc0NjQgMTYuNTk0NUM3LjkxNDk3IDE2LjMzNDggNy43NjkxIDE1Ljk4MjYgNy43NjkxIDE1LjYxNTRWMTQuOTk1MUM2LjEyNDE4IDE0LjMyNjggNS4wOTIxOSAxMi43MzgyIDQuNjc0OTYgMTAuMjI4M0M0LjY1NDgyIDEwLjEwNjUgNC42NTkzMiA5Ljk4MTkzIDQuNjg4MiA5Ljg2MTlDNC43MTcwNyA5Ljc0MTg2IDQuNzY5NzMgOS42Mjg4NCA0Ljg0MzA2IDkuNTI5NTJDNC45MTYzOSA5LjQzMDIgNS4wMDg5IDkuMzQ2NiA1LjExNTExIDkuMjgzNjZDNS4yMjEzMiA5LjIyMDczIDUuMzM5MDggOS4xNzk3NCA1LjQ2MTQyIDkuMTYzMTJWOS4xNjIxOVpNNi4zODQ0OSA5LjE1Mzg5SDcuMzA3NTZDNy4zMDc1NiA4LjU0MTg1IDcuNTUwNjkgNy45NTQ4OCA3Ljk4MzQ2IDcuNTIyMTFDOC40MTYyNCA3LjA4OTM0IDkuMDAzMjEgNi44NDYyMSA5LjYxNTI0IDYuODQ2MjFDMTAuMjI3MyA2Ljg0NjIxIDEwLjgxNDIgNy4wODkzNCAxMS4yNDcgNy41MjIxMUMxMS42Nzk4IDcuOTU0ODggMTEuOTIyOSA4LjU0MTg1IDExLjkyMjkgOS4xNTM4OUgxMi44NDZDMTIuODQ2IDguMjk3MDQgMTIuNTA1NiA3LjQ3NTI4IDExLjg5OTcgNi44Njk0QzExLjI5MzggNi4yNjM1MiAxMC40NzIxIDUuOTIzMTMgOS42MTUyNCA1LjkyMzEzQzguNzU4MzkgNS45MjMxMyA3LjkzNjY0IDYuMjYzNTIgNy4zMzA3NSA2Ljg2OTRDNi43MjQ4NyA3LjQ3NTI4IDYuMzg0NDkgOC4yOTcwNCA2LjM4NDQ5IDkuMTUzODlaTTguMjMwNjMgOS4xNTM4OUgxMC45OTk4QzEwLjk5OTggOC43ODY2NiAxMC44NTQgOC40MzQ0OCAxMC41OTQzIDguMTc0ODJDMTAuMzM0NiA3LjkxNTE2IDkuOTgyNDYgNy43NjkyOCA5LjYxNTI0IDcuNzY5MjhDOS4yNDgwMiA3Ljc2OTI4IDguODk1ODQgNy45MTUxNiA4LjYzNjE3IDguMTc0ODJDOC4zNzY1MSA4LjQzNDQ4IDguMjMwNjMgOC43ODY2NiA4LjIzMDYzIDkuMTUzODlaTTE0LjU2ODQgOS4xNTM4OUgxNS41NTcxQzE1LjYyNjcgOC44ODEwOSAxNS42MzMyIDguNTk1OTkgMTUuNTc2MSA4LjMyMDMxQzE1LjUxODkgOC4wNDQ2MiAxNS4zOTk1IDcuNzg1NjMgMTUuMjI3MSA3LjU2MzA2QzE1LjA1NDYgNy4zNDA1IDE0LjgzMzYgNy4xNjAyMyAxNC41ODEgNy4wMzZDMTQuMzI4MyA2LjkxMTc3IDE0LjA1MDYgNi44NDY4NiAxMy43NjkxIDYuODQ2MjFDMTMuNTQ3NSA2Ljg0NjIxIDEzLjMzNzEgNi44ODQ5NyAxMy4xNDE0IDYuOTU2MDVDMTMuMzA0OCA3LjIxODIgMTMuNDM5NSA3LjUwMDY2IDEzLjU0MjkgNy43OTY5N0MxMy43MTg3IDcuNzUzMzYgMTMuOTAzNSA3Ljc2MjM0IDE0LjA3NDIgNy44MjI3OUMxNC4yNDUgNy44ODMyNCAxNC4zOTQyIDcuOTkyNSAxNC41MDM1IDguMTM3MDFDMTQuNjEyNyA4LjI4MTUyIDE0LjY3NzEgOC40NTQ5MiAxNC42ODg2IDguNjM1NjlDMTQuNzAwMiA4LjgxNjQ2IDE0LjY1ODQgOC45OTY2NSAxNC41Njg0IDkuMTUzODlaTTEzLjMwNzUgMTUuMTUzOUg4LjY5MjE3VjE1LjYxNTRDOC42OTIxNyAxNS43Mzc4IDguNzQwNzkgMTUuODU1MiA4LjgyNzM1IDE1Ljk0MTdDOC45MTM5IDE2LjAyODMgOS4wMzEzIDE2LjA3NjkgOS4xNTM3IDE2LjA3NjlIMTIuODQ2QzEyLjk2ODQgMTYuMDc2OSAxMy4wODU4IDE2LjAyODMgMTMuMTcyMyAxNS45NDE3QzEzLjI1ODkgMTUuODU1MiAxMy4zMDc1IDE1LjczNzggMTMuMzA3NSAxNS42MTU0VjE1LjE1MzlaTTguMzY3MjUgMTQuMjMwOEgxMy42MzI1QzE1LjA5NjQgMTMuNzYgMTYuMDIzMiAxMi40Mjg5IDE2LjQxNDYgMTAuMDc3SDUuNTg1MTFDNS45NzY0OSAxMi40Mjg5IDYuOTAzMjUgMTMuNzYgOC4zNjcyNSAxNC4yMzA4WiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K'
          const hotPlace = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjQTIwODA1Ii8+DQo8cGF0aCBkPSJNMTUuMDUgMTAuNDI4OEMxNC44ODU3IDEwLjIxNDYgMTQuNjg1NyAxMC4wMjg5IDE0LjUwMDEgOS44NDMyMkMxNC4wMjE2IDkuNDE0NzIgMTMuNDc4OCA5LjEwNzY0IDEzLjAyMTggOC42NTc3MkMxMS45NTc3IDcuNjE1MDUgMTEuNzIyIDUuODkzOTQgMTIuNDAwNCA0LjU3Mjc1QzExLjcyMiA0LjczNzAxIDExLjEyOTIgNS4xMDgzNyAxMC42MjIyIDUuNTE1NDRDOC43NzI1MyA3LjAwMDg4IDguMDQ0MDkgOS42MjE4MyA4LjkxNTM2IDExLjg3MTRDOC45NDM5MyAxMS45NDI4IDguOTcyNSAxMi4wMTQyIDguOTcyNSAxMi4xMDcxQzguOTcyNSAxMi4yNjQyIDguODY1MzcgMTIuNDA3IDguNzIyNTQgMTIuNDY0MkM4LjU1ODI5IDEyLjUzNTYgOC4zODY4OSAxMi40OTI3IDguMjUxMiAxMi4zNzg1QzguMjEwNjcgMTIuMzQ0NSA4LjE3Njc3IDEyLjMwMzQgOC4xNTEyMiAxMi4yNTcxQzcuMzQ0MjIgMTEuMjM1OCA3LjIxNTY3IDkuNzcxOCA3Ljc1ODQzIDguNjAwNTlDNi41NjU3OSA5LjU3MTg0IDUuOTE1OTEgMTEuMjE0NCA2LjAwODc1IDEyLjc2NDFDNi4wNTE2IDEzLjEyMTIgNi4wOTQ0NSAxMy40NzgzIDYuMjE1ODYgMTMuODM1M0M2LjMxNTg0IDE0LjI2MzggNi41MDg2NiAxNC42OTIzIDYuNzIyOTEgMTUuMDcwOEM3LjQ5NDIgMTYuMzA2MyA4LjgyOTY3IDE3LjE5MTkgMTAuMjY1MSAxNy4zNzA0QzExLjc5MzQgMTcuNTYzMiAxMy40Mjg4IDE3LjI4NDcgMTQuNiAxNi4yMjc4QzE1LjkwNjkgMTUuMDQyMyAxNi4zNjQgMTMuMTQyNiAxNS42OTI3IDExLjUxNDNMMTUuNTk5OSAxMS4zMjg3QzE1LjQ0OTkgMTEuMDAwMSAxNS4wNSAxMC40Mjg4IDE1LjA1IDEwLjQyODhaTTEyLjc5MzIgMTQuOTI4QzEyLjU5MzMgMTUuMDk5NCAxMi4yNjQ4IDE1LjI4NTEgMTIuMDA3NyAxNS4zNTY1QzExLjIwNzggMTUuNjQyMiAxMC40MDc5IDE1LjI0MjIgOS45MzY2MSAxNC43NzA5QzEwLjc4NjQgMTQuNTcwOSAxMS4yOTM1IDEzLjk0MjUgMTEuNDQzNSAxMy4zMDY5QzExLjU2NDkgMTIuNzM1NSAxMS4zMzYzIDEyLjI2NDIgMTEuMjQzNSAxMS43MTQzQzExLjE1NzggMTEuMTg1OCAxMS4xNzIxIDEwLjczNTkgMTEuMzY0OSAxMC4yNDMxQzExLjUwMDYgMTAuNTE0NSAxMS42NDM0IDEwLjc4NTkgMTEuODE0OCAxMS4wMDAxQzEyLjM2NDcgMTEuNzE0MyAxMy4yMjg5IDEyLjAyODUgMTMuNDE0NSAxMi45OTk4QzEzLjQ0MzEgMTMuMDk5OCAxMy40NTc0IDEzLjE5OTcgMTMuNDU3NCAxMy4zMDY5QzEzLjQ3ODggMTMuODkyNSAxMy4yMjE3IDE0LjUzNTIgMTIuNzkzMiAxNC45MjhaIiBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+DQo='
          const lesureSports = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjNTg4NEVGIi8+DQo8cGF0aCBkPSJNNS42NjY2NyA4SDEzLjY2NjdDMTMuODQzNSA4IDE0LjAxMyA4LjA3MDI0IDE0LjEzODEgOC4xOTUyNkMxNC4yNjMxIDguMzIwMjkgMTQuMzMzMyA4LjQ4OTg2IDE0LjMzMzMgOC42NjY2N1YxMS42NjY3QzE0LjMzMzMgMTIuMTA4NyAxNC4xNTc3IDEyLjUzMjYgMTMuODQ1MiAxMi44NDUyQzEzLjUzMjYgMTMuMTU3NyAxMy4xMDg3IDEzLjMzMzMgMTIuNjY2NyAxMy4zMzMzSDEyLjMzMzNDMTEuOTc5NyAxMy4zMzMzIDExLjY0MDYgMTMuMTkyOSAxMS4zOTA1IDEyLjk0MjhDMTEuMTQwNSAxMi42OTI4IDExIDEyLjM1MzYgMTEgMTJDMTEgMTEuNjQ2NCAxMC44NTk1IDExLjMwNzIgMTAuNjA5NSAxMS4wNTcyQzEwLjM1OTQgMTAuODA3MSAxMC4wMjAzIDEwLjY2NjcgOS42NjY2NyAxMC42NjY3QzkuMzEzMDQgMTAuNjY2NyA4Ljk3MzkxIDEwLjgwNzEgOC43MjM4NiAxMS4wNTcyQzguNDczODEgMTEuMzA3MiA4LjMzMzMzIDExLjY0NjQgOC4zMzMzMyAxMkM4LjMzMzMzIDEyLjM1MzYgOC4xOTI4NiAxMi42OTI4IDcuOTQyODEgMTIuOTQyOEM3LjY5Mjc2IDEzLjE5MjkgNy4zNTM2MiAxMy4zMzMzIDcgMTMuMzMzM0g2LjY2NjY3QzYuMjI0NjQgMTMuMzMzMyA1LjgwMDcyIDEzLjE1NzcgNS40ODgxNiAxMi44NDUyQzUuMTc1NTkgMTIuNTMyNiA1IDEyLjEwODcgNSAxMS42NjY3VjguNjY2NjdDNSA4LjQ4OTg2IDUuMDcwMjQgOC4zMjAyOSA1LjE5NTI2IDguMTk1MjZDNS4zMjAyOSA4LjA3MDI0IDUuNDg5ODYgOCA1LjY2NjY3IDhaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuMzMzMzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTkuNjY2NzUgMTQuNjY2N0M5LjY2Njc1IDE1LjAyMDMgOS44MDcyMiAxNS4zNTk0IDEwLjA1NzMgMTUuNjA5NUMxMC4zMDczIDE1Ljg1OTUgMTAuNjQ2NSAxNiAxMS4wMDAxIDE2SDEzLjMzMzRDMTQuMzA1OSAxNiAxNS4yMzg1IDE1LjYxMzcgMTUuOTI2MSAxNC45MjYxQzE2LjYxMzggMTQuMjM4NCAxNy4wMDAxIDEzLjMwNTggMTcuMDAwMSAxMi4zMzMzVjYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS4zMzMzMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L3N2Zz4NCg=='
          const nature = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjMjA4ODZEIi8+DQo8cGF0aCBkPSJNMTAuNzAwOSA1LjQxNzM0TDcuMzgzOTMgOS4wNjY4OUM3LjI5Njg4IDkuMTYwNjQgNy4yNSA5LjI4NTY0IDcuMjUgOS40MTI4OEM3LjI1IDkuNjk4NTkgNy40Nzk5MSA5LjkyODUgNy43NjU2MiA5LjkyODVIOC4zMjE0M0w2LjY4MzA0IDExLjU2NjlDNi41ODkyOSAxMS42NjA2IDYuNTM1NzEgMTEuNzkwMSA2LjUzNTcxIDExLjkyNEM2LjUzNTcxIDEyLjIwMzEgNi43NjExNiAxMi40Mjg1IDcuMDQwMTggMTIuNDI4NUg3Ljc4NTcxTDYuMTIwNTQgMTQuNDI2M0M2LjA0MjQxIDE0LjUyIDYgMTQuNjM4MyA2IDE0Ljc2MTFDNiAxNS4wNTEzIDYuMjM0MzggMTUuMjg1NiA2LjUyNDU1IDE1LjI4NTZIMTAuMjg1N1YxNS45OTk5QzEwLjI4NTcgMTYuMzk1IDEwLjYwNDkgMTYuNzE0MiAxMSAxNi43MTQyQzExLjM5NTEgMTYuNzE0MiAxMS43MTQzIDE2LjM5NSAxMS43MTQzIDE1Ljk5OTlWMTUuMjg1NkgxNS40NzU0QzE1Ljc2NTYgMTUuMjg1NiAxNiAxNS4wNTEzIDE2IDE0Ljc2MTFDMTYgMTQuNjM4MyAxNS45NTc2IDE0LjUyIDE1Ljg3OTUgMTQuNDI2M0wxNC4yMTQzIDEyLjQyODVIMTQuOTU5OEMxNS4yMzg4IDEyLjQyODUgMTUuNDY0MyAxMi4yMDMxIDE1LjQ2NDMgMTEuOTI0QzE1LjQ2NDMgMTEuNzkwMSAxNS40MTA3IDExLjY2MDYgMTUuMzE3IDExLjU2NjlMMTMuNjc4NiA5LjkyODVIMTQuMjM0NEMxNC41MTc5IDkuOTI4NSAxNC43NSA5LjY5ODU5IDE0Ljc1IDkuNDEyODhDMTQuNzUgOS4yODU2NCAxNC43MDMxIDkuMTYwNjQgMTQuNjE2MSA5LjA2Njg5TDExLjI5OTEgNS40MTczNEMxMS4yMjMyIDUuMzMyNTIgMTEuMTEzOCA1LjI4NTY0IDExIDUuMjg1NjRDMTAuODg2MiA1LjI4NTY0IDEwLjc3NjggNS4zMzI1MiAxMC43MDA5IDUuNDE3MzRaIiBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+DQo='
          const park = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjRUY4RkFBIi8+DQo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjk5OTMgNC41QzExLjI2NjYgNC40OTk5NiAxMS41MzA1IDQuNTU5ODUgMTEuNzcxNiA0LjY3NTI3QzEyLjAxMjcgNC43OTA2OSAxMi4yMjQ4IDQuOTU4NyAxMi4zOTI0IDUuMTY2OTNDMTIuNTYgNS4zNzUxNyAxMi42Nzg4IDUuNjE4MzQgMTIuNzQgNS44Nzg1M0MxMi44MDExIDYuMTM4NzMgMTIuODAzMiA2LjQwOTM0IDEyLjc0NiA2LjY3MDQ0QzEyLjk3OTIgNi43NzgxMSAxMy4xOTk3IDYuOTA1NDQgMTMuNDA3NSA3LjA1MjQ0QzEzLjYwNTEgNi44NzI2OCAxMy44NDA0IDYuNzM5NDggMTQuMDk2MyA2LjY2MjYyQzE0LjM1MjEgNi41ODU3NiAxNC42MjE5IDYuNTY3MjEgMTQuODg1OCA2LjYwODMxQzE1LjE0OTggNi42NDk0MiAxNS40MDExIDYuNzQ5MTUgMTUuNjIxNSA2LjkwMDE3QzE1Ljg0MTggNy4wNTExOCAxNi4wMjU1IDcuMjQ5NjUgMTYuMTU5IDcuNDgwOTlDMTYuMjkyNiA3LjcxMjMyIDE2LjM3MjYgNy45NzA2NCAxNi4zOTMyIDguMjM2OTZDMTYuNDEzOCA4LjUwMzI4IDE2LjM3NDUgOC43NzA4NCAxNi4yNzgxIDkuMDE5OTZDMTYuMTgxNyA5LjI2OTA4IDE2LjAzMDcgOS40OTM0NCAxNS44MzYyIDkuNjc2NTVDMTUuNjQxOCA5Ljg1OTY1IDE1LjQwODcgOS45OTY4NiAxNS4xNTQyIDEwLjA3ODFDMTUuMTc3NSAxMC4zMzE4IDE1LjE3NzUgMTAuNTg3MSAxNS4xNTQyIDEwLjg0MDlDMTUuNDA4OCAxMC45MjIgMTUuNjQyIDExLjA1OTEgMTUuODM2NiAxMS4yNDIyQzE2LjAzMTIgMTEuNDI1MiAxNi4xODIzIDExLjY0OTYgMTYuMjc4OCAxMS44OTg3QzE2LjM3NTMgMTIuMTQ3OSAxNi40MTQ3IDEyLjQxNTUgMTYuMzk0MSAxMi42ODE4QzE2LjM3MzYgMTIuOTQ4MiAxNi4yOTM2IDEzLjIwNjYgMTYuMTYwMSAxMy40MzhDMTYuMDI2NSAxMy42Njk0IDE1Ljg0MjggMTMuODY4IDE1LjYyMjQgMTQuMDE5QzE1LjQwMjEgMTQuMTcwMSAxNS4xNTA2IDE0LjI2OTggMTQuODg2NyAxNC4zMTA5QzE0LjYyMjcgMTQuMzUyIDE0LjM1MjggMTQuMzMzNSAxNC4wOTY5IDE0LjI1NjVDMTMuODQxMSAxNC4xNzk2IDEzLjYwNTcgMTQuMDQ2NCAxMy40MDgxIDEzLjg2NjVDMTMuMjkzNyAxMy45NDY4IDEzLjE3NjEgMTQuMDIxNSAxMy4wNTUzIDE0LjA5MDZMMTIuODcwNiAxNC4xODg5TDEzLjM1MjcgMTUuNjM0N0MxMy40MDAyIDE1Ljc3ODggMTMuMzkwOSAxNS45MzU2IDEzLjMyNjggMTYuMDczMUMxMy4yNjI3IDE2LjIxMDYgMTMuMTQ4NSAxNi4zMTg0IDEzLjAwNzYgMTYuMzc0N0MxMi44NjY3IDE2LjQzMDkgMTIuNzA5NiAxNi40MzEzIDEyLjU2ODUgMTYuMzc1N0MxMi40MjczIDE2LjMyMDIgMTIuMzEyNiAxNi4yMTI5IDEyLjI0NzggMTYuMDc1N0wxMi4yMjE2IDE2LjAxMTNMMTEuNzQwMSAxNC41NjU2QzExLjMxMSAxNC42NDMgMTAuODcyNCAxNC42NTI2IDEwLjQ0MDMgMTQuNTk0MkwxMC4yNTg1IDE0LjU2NTZMOS43NzcwMSAxNi4wMTEzQzkuNzI5MjEgMTYuMTU1OSA5LjYyNzg3IDE2LjI3NjggOS40OTM3NyAxNi4zNDlDOS4zNTk2OCAxNi40MjEyIDkuMjAzMDIgMTYuNDM5NCA5LjA1NTk3IDE2LjM5OTdDOC45MDg5MiAxNi4zNiA4Ljc4MjYzIDE2LjI2NTYgOC43MDMwNSAxNi4xMzU3QzguNjIzNDYgMTYuMDA1OSA4LjU5NjYxIDE1Ljg1MDUgOC42MjgwMiAxNS43MDE0TDguNjQ1OSAxNS42MzQ3TDkuMTI4MDIgMTQuMTg4OUM4Ljk0MTQzIDE0LjA5NTIgOC43NjIxNSAxMy45ODc2IDguNTkxNjcgMTMuODY3MUM4LjM5NDA5IDE0LjA0NyA4LjE1ODcxIDE0LjE4MDIgNy45MDI4NSAxNC4yNTcxQzcuNjQ2OTggMTQuMzM0MSA3LjM3NzEzIDE0LjM1MjYgNy4xMTMxMyAxNC4zMTE1QzYuODQ5MTQgMTQuMjcwNCA2LjU5NzcxIDE0LjE3MDcgNi4zNzczNCAxNC4wMTk2QzYuMTU2OTcgMTMuODY4NiA1Ljk3MzI1IDEzLjY3IDUuODM5NzEgMTMuNDM4NkM1LjcwNjE2IDEzLjIwNzIgNS42MjYxOCAxMi45NDg4IDUuNjA1NjMgMTIuNjgyNEM1LjU4NTA5IDEyLjQxNjEgNS42MjQ1MiAxMi4xNDg1IDUuNzIxIDExLjg5OTNDNS44MTc0OSAxMS42NTAyIDUuOTY4NiAxMS40MjU4IDYuMTYzMiAxMS4yNDI4QzYuMzU3ODEgMTEuMDU5NyA2LjU5MDk3IDEwLjkyMjYgNi44NDU1NCAxMC44NDE1QzYuODIyMDEgMTAuNTg3NiA2LjgyMTgxIDEwLjMzMiA2Ljg0NDk0IDEwLjA3ODFDNi41OTA0NyA5Ljk5Njg2IDYuMzU3NDMgOS44NTk2NSA2LjE2Mjk1IDkuNjc2NTVDNS45Njg0NyA5LjQ5MzQ0IDUuODE3NDkgOS4yNjkwOCA1LjcyMTEgOS4wMTk5NkM1LjYyNDcyIDguNzcwODQgNS41ODUzOSA4LjUwMzI4IDUuNjA1OTkgOC4yMzY5NkM1LjYyNjU5IDcuOTcwNjQgNS43MDY2MSA3LjcxMjMyIDUuODQwMTYgNy40ODA5OUM1Ljk3MzcxIDcuMjQ5NjUgNi4xNTc0IDcuMDUxMTggNi4zNzc3MyA2LjkwMDE3QzYuNTk4MDYgNi43NDkxNSA2Ljg0OTQzIDYuNjQ5NDIgNy4xMTMzNyA2LjYwODMxQzcuMzc3MzEgNi41NjcyMSA3LjY0NzEgNi41ODU3NiA3LjkwMjkyIDYuNjYyNjJDOC4xNTg3NCA2LjczOTQ4IDguMzk0MDkgNi44NzI2OCA4LjU5MTY3IDcuMDUyNDRDOC43OTk4MyA2LjkwNTE4IDkuMDIxMDYgNi43NzczMSA5LjI1MjU3IDYuNjcwNDRDOS4xOTUzNyA2LjQwOTM0IDkuMTk3NDQgNi4xMzg3MyA5LjI1ODY0IDUuODc4NTNDOS4zMTk4MyA1LjYxODM0IDkuNDM4NTkgNS4zNzUxNyA5LjYwNjE4IDUuMTY2OTNDOS43NzM3NiA0Ljk1ODcgOS45ODU5MSA0Ljc5MDY5IDEwLjIyNyA0LjY3NTI3QzEwLjQ2ODEgNC41NTk4NSAxMC43MzIgNC40OTk5NiAxMC45OTkzIDQuNVpNMTAuOTk5MyAxMi4zNDM5TDEwLjY0MTcgMTMuNDE4NEMxMC44NzkyIDEzLjQ0NzEgMTEuMTE5MyAxMy40NDcxIDExLjM1NjkgMTMuNDE4NEwxMC45OTkzIDEyLjM0MzlaTTcuOTAyNzUgMTIuMjQ3M0M3Ljg2MzkxIDEyLjE3OSA3LjgxMTkzIDEyLjExOSA3Ljc0OTgyIDEyLjA3MDlDNy42ODc3IDEyLjAyMjcgNy42MTY2OCAxMS45ODczIDcuNTQwODMgMTEuOTY2N0M3LjQ2NDk4IDExLjk0NjEgNy4zODU4MSAxMS45NDA4IDcuMzA3ODcgMTEuOTUwOUM3LjIyOTkzIDExLjk2MSA3LjE1NDc3IDExLjk4NjUgNy4wODY3IDEyLjAyNThDNy4wMTg2NCAxMi4wNjUxIDYuOTU5MDIgMTIuMTE3NCA2LjkxMTI4IDEyLjE3OTlDNi44NjM1NCAxMi4yNDIzIDYuODI4NjIgMTIuMzEzNiA2LjgwODUzIDEyLjM4OTVDNi43ODg0NCAxMi40NjU1IDYuNzgzNTggMTIuNTQ0NyA2Ljc5NDIzIDEyLjYyMjZDNi44MDQ4OCAxMi43MDA1IDYuODMwODIgMTIuNzc1NSA2Ljg3MDU3IDEyLjg0MzNDNi45NTAxNiAxMi45NzkgNy4wODAyMiAxMy4wNzc4IDcuMjMyMzYgMTMuMTE4QzcuMzg0NSAxMy4xNTgyIDcuNTQ2MzggMTMuMTM2NyA3LjY4MjY3IDEzLjA1OEM3LjgxODk1IDEyLjk3OTMgNy45MTg1OCAxMi44NDk5IDcuOTU5ODEgMTIuNjk4QzguMDAxMDUgMTIuNTQ2MSA3Ljk4MDUzIDEyLjM4NDEgNy45MDI3NSAxMi4yNDczWk0xNC4wOTU4IDEyLjI0NzNDMTQuMDU2MSAxMi4zMTUxIDE0LjAzMDEgMTIuMzkwMSAxNC4wMTk1IDEyLjQ2OEMxNC4wMDg5IDEyLjU0NTkgMTQuMDEzNyAxMi42MjUxIDE0LjAzMzggMTIuNzAxQzE0LjA1MzkgMTIuNzc3IDE0LjA4ODggMTIuODQ4MyAxNC4xMzY2IDEyLjkxMDdDMTQuMTg0MyAxMi45NzMxIDE0LjI0MzkgMTMuMDI1NSAxNC4zMTIgMTMuMDY0OEMxNC4zOCAxMy4xMDQxIDE0LjQ1NTIgMTMuMTI5NiAxNC41MzMxIDEzLjEzOTdDMTQuNjExMSAxMy4xNDk4IDE0LjY5MDIgMTMuMTQ0NCAxNC43NjYxIDEzLjEyMzhDMTQuODQxOSAxMy4xMDMzIDE0LjkxMyAxMy4wNjc5IDE0Ljk3NTEgMTMuMDE5N0MxNS4wMzcyIDEyLjk3MTYgMTUuMDg5MiAxMi45MTE2IDE1LjEyOCAxMi44NDMzQzE1LjIwNTggMTIuNzA2NSAxNS4yMjYzIDEyLjU0NDQgMTUuMTg1MSAxMi4zOTI2QzE1LjE0MzggMTIuMjQwNyAxNS4wNDQyIDEyLjExMTMgMTQuOTA3OSAxMi4wMzI2QzE0Ljc3MTYgMTEuOTUzOSAxNC42MDk4IDExLjkzMjMgMTQuNDU3NiAxMS45NzI2QzE0LjMwNTUgMTIuMDEyOCAxNC4xNzU0IDEyLjExMTYgMTQuMDk1OCAxMi4yNDczWk0xMi4xMDU0IDcuNjkxODlDMTEuNzkwMiA3Ljk0MDM0IDExLjQwMDYgOC4wNzU1MiAxMC45OTkzIDguMDc1NjlDMTAuNTgxNSA4LjA3NTY5IDEwLjE5NzEgNy45MzI2NiA5Ljg5MjYyIDcuNjkxODlDOS42MjYyMyA3Ljc5OTE3IDkuMzc4MzIgNy45NDI3OSA5LjE1NjAzIDguMTE4QzkuMjEzNDMgOC41MTUxNSA5LjEzNTU1IDguOTIwMDYgOC45MzQ5MyA5LjI2NzU4QzguNzM0MzEgOS42MTUxMiA4LjQyMjYgOS44ODUwNyA4LjA0OTk1IDEwLjAzNEM4LjAwOTIzIDEwLjMxNjIgOC4wMDkyMyAxMC42MDI4IDguMDQ5OTUgMTAuODg1QzguNDIzMDIgMTEuMDMzNSA4LjczNTEzIDExLjMwMzQgOC45MzU4NCAxMS42NTEyQzkuMTM2NTQgMTEuOTk4OSA5LjIxNDEyIDEyLjQwNDIgOS4xNTYwMyAxMi44MDE1QzkuMjY4NDYgMTIuODg5NCA5LjM4NjY2IDEyLjk2OTIgOS41MTA2MiAxMy4wNDExTDEwLjQzNDMgMTAuMjcxMkMxMC40NzM5IDEwLjE1MjYgMTAuNTQ5OCAxMC4wNDk1IDEwLjY1MTMgOS45NzYzOEMxMC43NTI3IDkuOTAzMzEgMTAuODc0NiA5Ljg2Mzk5IDEwLjk5OTYgOS44NjM5OUMxMS4xMjQ2IDkuODYzOTkgMTEuMjQ2NSA5LjkwMzMxIDExLjM0NzkgOS45NzYzOEMxMS40NDk0IDEwLjA0OTUgMTEuNTI1MiAxMC4xNTI2IDExLjU2NDggMTAuMjcxMkwxMi40ODg2IDEzLjA0MTFDMTIuNjEyMiAxMi45Njk2IDEyLjczMDUgMTIuODg5NCAxMi44NDI2IDEyLjgwMUMxMi43ODUgMTIuNDAzOSAxMi44NjI2IDExLjk5OSAxMy4wNjMxIDExLjY1MTRDMTMuMjY0IDExLjMwMzYgMTMuNTc2MSAxMS4wMzM3IDEzLjk0OTIgMTAuODg1QzEzLjk5IDEwLjYwMjggMTMuOTkgMTAuMzE2MiAxMy45NDkyIDEwLjAzNEMxMy41NzYxIDkuODg1MjkgMTMuMjY0IDkuNjE1MzMgMTMuMDYzMSA5LjI2NzU4QzEyLjg2MjQgOC45MjAwNiAxMi43ODQ2IDguNTE1MTUgMTIuODQyIDguMTE4QzEyLjYxODEgNy45NDE0NSAxMi4zNyA3Ljc5Nzk2IDEyLjEwNTQgNy42OTE4OVpNNi44NzExNyA4LjA3NTY5QzYuODMxNDIgOC4xNDM0OSA2LjgwNTQ3IDguMjE4NDggNi43OTQ4MyA4LjI5NjM1QzYuNzg0MTggOC4zNzQyMiA2Ljc4OTA0IDguNDUzNDIgNi44MDkxMyA4LjUyOTQxQzYuODI5MjIgOC42MDUzOSA2Ljg2NDE0IDguNjc2NjUgNi45MTE4OCA4LjczOTA4QzYuOTU5NjIgOC44MDE1MSA3LjAxOTI0IDguODUzODkgNy4wODczIDguODkzMThDNy4xNTUzNiA4LjkzMjQ4IDcuMjMwNTMgOC45NTc5MyA3LjMwODQ3IDguOTY4MDZDNy4zODY0IDguOTc4MTkgNy40NjU1OCA4Ljk3MjggNy41NDE0MiA4Ljk1MjIxQzcuNjE3MjcgOC45MzE2MiA3LjY4ODMgOC44OTYyMyA3Ljc1MDQxIDguODQ4MDdDNy44MTI1MyA4Ljc5OTkyIDcuODY0NSA4LjczOTk2IDcuOTAzMzUgOC42NzE2M0M3Ljk4MTEzIDguNTM0ODMgOC4wMDE2NCA4LjM3MjgxIDcuOTYwNDEgOC4yMjA5NEM3LjkxOTE4IDguMDY5MDcgNy44MTk1NSA3LjkzOTY3IDcuNjgzMjYgNy44NjA5OEM3LjU0Njk4IDcuNzgyMjkgNy4zODUxIDcuNzYwNzEgNy4yMzI5NiA3LjgwMDkzQzcuMDgwODEgNy44NDExNSA2Ljk1MDc2IDcuOTM5OTIgNi44NzExNyA4LjA3NTY5Wk0xNC4zMTQ2IDcuODU3NTdDMTQuMjQ2MiA3Ljg5NjQxIDE0LjE4NjMgNy45NDgzOSAxNC4xMzgxIDguMDEwNUMxNC4wOSA4LjA3MjYyIDE0LjA1NDYgOC4xNDM2NCAxNC4wMzQgOC4yMTk0OUMxNC4wMTM0IDguMjk1MzQgMTQuMDA4IDguMzc0NTEgMTQuMDE4MSA4LjQ1MjQ1QzE0LjAyODMgOC41MzAzOSAxNC4wNTM3IDguNjA1NTUgMTQuMDkzIDguNjczNjJDMTQuMTMyMyA4Ljc0MTY4IDE0LjE4NDcgOC44MDEzIDE0LjI0NzEgOC44NDkwNEMxNC4zMDk1IDguODk2NzggMTQuMzgwOCA4LjkzMTcgMTQuNDU2OCA4Ljk1MTc5QzE0LjUzMjggOC45NzE4OCAxNC42MTIgOC45NzY3NCAxNC42ODk4IDguOTY2MDlDMTQuNzY3NyA4Ljk1NTQ0IDE0Ljg0MjcgOC45Mjk1IDE0LjkxMDUgOC44ODk3NUMxNS4wNDYzIDguODEwMTYgMTUuMTQ1IDguNjgwMSAxNS4xODUzIDguNTI3OTZDMTUuMjI1NSA4LjM3NTgyIDE1LjIwMzkgOC4yMTM5NCAxNS4xMjUyIDguMDc3NjVDMTUuMDQ2NSA3Ljk0MTM3IDE0LjkxNzEgNy44NDE3NCAxNC43NjUyIDcuODAwNTFDMTQuNjEzNCA3Ljc1OTI3IDE0LjQ1MTQgNy43Nzk3OSAxNC4zMTQ2IDcuODU3NTdaTTEwLjk5OTMgNS42OTE5QzEwLjg0MTIgNS42OTE5IDEwLjY4OTcgNS43NTQ2OCAxMC41Nzc5IDUuODY2NDRDMTAuNDY2MSA1Ljk3ODIxIDEwLjQwMzMgNi4xMjk3OSAxMC40MDMzIDYuMjg3ODRDMTAuNDAzMyA2LjQ0NTkgMTAuNDY2MSA2LjU5NzQ4IDEwLjU3NzkgNi43MDkyNEMxMC42ODk3IDYuODIxIDEwLjg0MTIgNi44ODM3OSAxMC45OTkzIDYuODgzNzlDMTEuMTU3NCA2Ljg4Mzc5IDExLjMwODkgNi44MjEgMTEuNDIwNyA2LjcwOTI0QzExLjUzMjUgNi41OTc0OCAxMS41OTUyIDYuNDQ1OSAxMS41OTUyIDYuMjg3ODRDMTEuNTk1MiA2LjEyOTc5IDExLjUzMjUgNS45NzgyMSAxMS40MjA3IDUuODY2NDRDMTEuMzA4OSA1Ljc1NDY4IDExLjE1NzQgNS42OTE5IDEwLjk5OTMgNS42OTE5WiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K'
          const star = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjRkZDMDNGIi8+DQo8cGF0aCBkPSJNMTAuOTk5OCAxNS4wNDk2TDE0LjA0NDYgMTYuODkxMkMxNC42MDIyIDE3LjIyODcgMTUuMjg0NSAxNi43Mjk4IDE1LjEzNzggMTYuMDk4OEwxNC4zMzA3IDEyLjYzNThMMTcuMDIzMyAxMC4zMDI3QzE3LjUxNDkgOS44NzcxNyAxNy4yNTA4IDkuMDcwMTEgMTYuNjA1MSA5LjAxODc1TDEzLjA2MTQgOC43MTc5NEwxMS42NzQ4IDUuNDQ1NzFDMTEuNDI1MyA0Ljg1MTQzIDEwLjU3NDIgNC44NTE0MyAxMC4zMjQ4IDUuNDQ1NzFMOC45MzgxMyA4LjcxMDYxTDUuMzk0NDQgOS4wMTE0MkM0Ljc0ODc5IDkuMDYyNzggNC40ODQ2NyA5Ljg2OTgzIDQuOTc2MjQgMTAuMjk1NEw3LjY2ODg2IDEyLjYyODVMNi44NjE4IDE2LjA5MTVDNi43MTUwNyAxNi43MjI0IDcuMzk3MzkgMTcuMjIxMyA3Ljk1NDk5IDE2Ljg4MzhMMTAuOTk5OCAxNS4wNDk2WiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg'
          const tour = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjNzlBNzEwIi8+DQo8cGF0aCBkPSJNNi43ODk0NSA4LjEwNTI2QzcuMzcwOCA4LjEwNTI2IDcuODQyMDggNy42MzM5OCA3Ljg0MjA4IDcuMDUyNjNDNy44NDIwOCA2LjQ3MTI4IDcuMzcwOCA2IDYuNzg5NDUgNkM2LjIwODEgNiA1LjczNjgyIDYuNDcxMjggNS43MzY4MiA3LjA1MjYzQzUuNzM2ODIgNy42MzM5OCA2LjIwODEgOC4xMDUyNiA2Ljc4OTQ1IDguMTA1MjZaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuMDUyNjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTEzLjEwNTMgMTIuMzE1OEMxMy4xMDUzIDEyLjMxNTggMTMuNjMxNiAxMC43MzY4IDEzLjYzMTYgOC4xMDUyNlY3LjA1MjYzQzEzLjYzMTYgNy4wNTI2MyAxMy4xMDUzIDYgMTIuMDUyNiA2QzExLjUyNjMgNiAxMSA2LjI2MzE2IDExIDYuMjYzMTYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS4wNTI2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTEuNTI2NCA5LjE1OEMxMS41MjY0IDguNTk5NjUgMTEuNzQ4MiA4LjA2NDE3IDEyLjE0MyA3LjY2OTM1QzEyLjUzNzggNy4yNzQ1NCAxMy4wNzMzIDcuMDUyNzMgMTMuNjMxNiA3LjA1MjczQzE0LjE5IDcuMDUyNzMgMTQuNzI1NSA3LjI3NDU0IDE1LjEyMDMgNy42NjkzNUMxNS41MTUxIDguMDY0MTcgMTUuNzM2OSA4LjU5OTY1IDE1LjczNjkgOS4xNTgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS4wNTI2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTMuNjMxNiA3LjA1MjYzQzEzLjYzMTYgNy4wNTI2MyAxNC4xNTc5IDYgMTUuMjEwNiA2QzE1LjczNjkgNiAxNi4yNjMyIDYuMjYzMTYgMTYuMjYzMiA2LjI2MzE2TTguODk0NzYgMTEuNzg5NUw5Ljk0NzM5IDE2TTYuMjYzMTggMTZMNi42MzE2IDE0Ljg5NDdDNi43MzY4NyAxNC42MzE2IDcuMDAwMDMgMTQuNDIxMSA3LjMxNTgyIDE0LjQyMTFIMTMuNjMxNkMxMy44OTQ4IDE0LjQyMTEgMTQuMzE1OCAxNC4yMTA1IDE0LjQ3MzcgMTRMMTYuMjYzMiAxMS43ODk1TTE1LjczNjkgMTZMMTQuMTU3OSAxNC40MjExTTYuNzg5NSAxMi4zMTU4TDguMzY4NDUgOS42ODQyMUwxMSAxMS4yNjMyTDYuNzg5NSAxMi4zMTU4WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjA1MjYzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjwvc3ZnPg0K'
          const toilet = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjOTY5NzlFIi8+DQo8cGF0aCBkPSJNMTIuNjU5OCAxN1YxNC4xOTEySDEwLjg3MjRWMTQuMDYzNkwxMC45MDkyIDEzLjk4N0MxMS43MjU3IDEyLjI3MjEgMTIuMTQ5MyAxMC4zOTY1IDEyLjE0OTEgOC40OTcxNVY4LjMyOTY0QzEyLjYzOTggOC4xNTAxOSAxMy4xNTg3IDguMDU5NzQgMTMuNjgxMiA4LjA2MjU2QzE0LjMzODkgOC4wNjI1NiAxNC44NjEzIDguMTk4NCAxNS4yMTMyIDguMzI5NjRWOC40OTcxNUMxNS4yMTMyIDEwLjM5NjkgMTUuNjM3MSAxMi4yNzE2IDE2LjQ1MzEgMTMuOTg2NUwxNi40ODk5IDE0LjA2MzFWMTQuMTkwN0gxNC43MDI1VjE3TTguNTc0MzQgMTdWMTMuNjgwNkM4LjU3NDM0IDEzLjQwOTcgOC42ODE5NSAxMy4xNDk5IDguODczNSAxMi45NTg0QzkuMDY1MDQgMTIuNzY2OCA5LjMyNDgzIDEyLjY1OTIgOS41OTU3MSAxMi42NTkyVjguNTczNzVDOS41OTU3MSA4LjU3Mzc1IDguODI5NjkgOC4wNjMwNyA3LjU1Mjk4IDguMDYzMDdDNi4yNzYyOCA4LjA2MzA3IDUuNTEwMjUgOC41NzM3NSA1LjUxMDI1IDguNTczNzVWMTIuNjU5MkM1Ljc4MTE0IDEyLjY1OTIgNi4wNDA5MiAxMi43NjY4IDYuMjMyNDcgMTIuOTU4NEM2LjQyNDAxIDEzLjE0OTkgNi41MzE2MiAxMy40MDk3IDYuNTMxNjIgMTMuNjgwNlYxN00xMy42MDQ2IDcuMDQxNzFDMTMuNjA0NiA3LjA0MTcxIDEyLjc4NzUgNi41MzEwMiAxMi43ODc1IDUuODkyNjdDMTIuNzg3NSA1LjY1NTkyIDEyLjg4MTUgNS40Mjg4NyAxMy4wNDg5IDUuMjYxNDZDMTMuMjE2MyA1LjA5NDA1IDEzLjQ0MzQgNSAxMy42ODAxIDVDMTMuOTE2OSA1IDE0LjE0MzkgNS4wOTQwNSAxNC4zMTE0IDUuMjYxNDZDMTQuNDc4OCA1LjQyODg3IDE0LjU3MjggNS42NTU5MiAxNC41NzI4IDUuODkyNjdDMTQuNTcyOCA2LjUzMTAyIDEzLjc1NzggNy4wNDE3MSAxMy43NTc4IDcuMDQxNzFIMTMuNjA0NlpNNy40NzYzOCA3LjA0MTcxQzcuNDc2MzggNy4wNDE3MSA2LjY1OTI5IDYuNTMxMDIgNi42NTkyOSA1Ljg5MjY3QzYuNjU5MjkgNS43NzU0NCA2LjY4MjM4IDUuNjU5MzYgNi43MjcyNCA1LjU1MTA2QzYuNzcyMSA1LjQ0Mjc2IDYuODM3ODUgNS4zNDQzNSA2LjkyMDc1IDUuMjYxNDZDNy4wMDM2NCA1LjE3ODU3IDcuMTAyMDQgNS4xMTI4MSA3LjIxMDM1IDUuMDY3OTVDNy4zMTg2NSA1LjAyMzA5IDcuNDM0NzMgNSA3LjU1MTk2IDVDNy42NjkxOSA1IDcuNzg1MjcgNS4wMjMwOSA3Ljg5MzU3IDUuMDY3OTVDOC4wMDE4NyA1LjExMjgxIDguMTAwMjggNS4xNzg1NyA4LjE4MzE3IDUuMjYxNDZDOC4yNjYwNyA1LjM0NDM1IDguMzMxODIgNS40NDI3NiA4LjM3NjY4IDUuNTUxMDZDOC40MjE1NCA1LjY1OTM2IDguNDQ0NjMgNS43NzU0NCA4LjQ0NDYzIDUuODkyNjdDOC40NDQ2MyA2LjUzMTAyIDcuNjI5NTggNy4wNDE3MSA3LjYyOTU4IDcuMDQxNzFINy40NzYzOFoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC44NSIvPg0KPC9zdmc+DQo'
          const parking = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjRkY3NTEyIi8+DQo8cGF0aCBkPSJNNy40NTY0MyAxNy4wNzE2QzcuMzU1IDE3LjA3MTYgNy4yNyAxNy4wMzczIDcuMjAxNDMgMTYuOTY4N0M3LjEzMjg2IDE2LjkwMDEgNy4wOTkwNSAxNi44MTU0IDcuMSAxNi43MTQ0VjE1LjM2MDFDNi44NjcxNCAxNS4yNTkyIDYuNjI1NzEgMTUuMDQ0NyA2LjM3NTcxIDE0LjcxNjZDNi4xMjU3MSAxNC4zODg1IDYuMDAwNDggMTQuMDEwNCA2IDEzLjU4MjNWNy4wNzE1N0M2IDYuMzMwNjIgNi40MDA5NSA1Ljc4ODIzIDcuMjAyODYgNS40NDQ0M0M4LjAwNTcxIDUuMTAwNjIgOS4yNzE0MyA0LjkyODcxIDExIDQuOTI4NzFDMTIuNzkxOSA0LjkyODcxIDE0LjA3MzMgNS4wOTM5NSAxNC44NDQzIDUuNDI0NDNDMTUuNjE1MiA1Ljc1NDkgMTYuMDAwNSA2LjMwMzk1IDE2IDcuMDcxNTdWMTMuNTgzQzE2IDE0LjAxMDYgMTUuODc1IDE0LjM4ODUgMTUuNjI1IDE0LjcxNjZDMTUuMzc1IDE1LjA0NTEgMTUuMTMzNiAxNS4yNTk0IDE0LjkwMDcgMTUuMzU5NFYxNi43MTQ0QzE0LjkwMDcgMTYuODE1OSAxNC44NjY3IDE2LjkwMDYgMTQuNzk4NiAxNi45Njg3QzE0LjczMDUgMTcuMDM2OCAxNC42NDUyIDE3LjA3MTEgMTQuNTQyOSAxNy4wNzE2SDE0LjM3ODZDMTQuMjc3MSAxNy4wNzE2IDE0LjE5MjEgMTcuMDM3MyAxNC4xMjM2IDE2Ljk2ODdDMTQuMDU1IDE2LjkwMDEgMTQuMDIxIDE2LjgxNTQgMTQuMDIxNCAxNi43MTQ0VjE1LjY0M0g3Ljk3Nzg2VjE2LjcxNDRDNy45Nzc4NiAxNi44MTU5IDcuOTQzNTcgMTYuOTAwNiA3Ljg3NSAxNi45Njg3QzcuODA2NDMgMTcuMDM2OCA3LjcyMTkgMTcuMDcxMSA3LjYyMTQzIDE3LjA3MTZINy40NTY0M1pNMTEuMDA4NiA2Ljc0MjI4SDE1LjIyNzlINi43ODg1N0gxMS4wMDg2Wk0xMy44NTcxIDExLjM1NzNINi43MTQyOUgxNS4yODU3SDEzLjg1NzFaTTYuNzE0MjkgMTAuNjQzSDE1LjI4NTdWNy40NTY1N0g2LjcxNDI5VjEwLjY0M1pNOC41MDM1NyAxMy45NDAxQzguNzI1NDggMTMuOTQwMSA4LjkxMzEgMTMuODYyMyA5LjA2NjQzIDEzLjcwNjZDOS4yMjAyNCAxMy41NTA5IDkuMjk3MTQgMTMuMzYyIDkuMjk3MTQgMTMuMTQwMUM5LjI5NzE0IDEyLjkxNzggOS4yMTkyOSAxMi43Mjk3IDkuMDYzNTcgMTIuNTc1OUM4LjkwNzg2IDEyLjQyMyA4LjcxOTA1IDEyLjM0NjYgOC40OTcxNCAxMi4zNDY2QzguMjc0NzYgMTIuMzQ2NiA4LjA4NjY3IDEyLjQyNDIgNy45MzI4NiAxMi41Nzk0QzcuNzc5NTIgMTIuNzM1MSA3LjcwMjg2IDEyLjkyMzkgNy43MDI4NiAxMy4xNDU5QzcuNzAyODYgMTMuMzY4MiA3Ljc4MDcxIDEzLjU1NjMgNy45MzY0MyAxMy43MTAxQzguMDkyMTQgMTMuODYzNSA4LjI4MDk1IDEzLjk0MDEgOC41MDI4NiAxMy45NDAxTTEzLjUwMjkgMTMuOTQwMUMxMy43MjUyIDEzLjk0MDEgMTMuOTEzMyAxMy44NjIzIDE0LjA2NzEgMTMuNzA2NkMxNC4yMiAxMy41NTA5IDE0LjI5NjQgMTMuMzYyIDE0LjI5NjQgMTMuMTQwMUMxNC4yOTY0IDEyLjkxNzggMTQuMjE4OCAxMi43Mjk3IDE0LjA2MzYgMTIuNTc1OUMxMy45MDc5IDEyLjQyMyAxMy43MTg4IDEyLjM0NjYgMTMuNDk2NCAxMi4zNDY2QzEzLjI3NDUgMTIuMzQ2NiAxMy4wODY5IDEyLjQyNDIgMTIuOTMzNiAxMi41Nzk0QzEyLjc3OTggMTIuNzM1MSAxMi43MDI5IDEyLjkyMzkgMTIuNzAyOSAxMy4xNDU5QzEyLjcwMjkgMTMuMzY4MiAxMi43ODA3IDEzLjU1NjMgMTIuOTM2NCAxMy43MTAxQzEzLjA5MjEgMTMuODYzNSAxMy4yODEgMTMuOTQwMSAxMy41MDI5IDEzLjk0MDFaTTYuNzg4NTcgNi43NDIyOEgxNS4yMjc5QzE1LjEwNCA2LjM3NDY2IDE0LjcyMjQgNi4wOTk2NiAxNC4wODI5IDUuOTE3MjhDMTMuNDQzMyA1LjczNDQyIDEyLjQxODYgNS42NDMgMTEuMDA4NiA1LjY0M0M5LjYwNjE5IDUuNjQzIDguNTg1MjQgNS43MzU4NSA3Ljk0NTcxIDUuOTIxNTdDNy4zMDYxOSA2LjEwNjgxIDYuOTIwNDggNi4zODAzOCA2Ljc4ODU3IDYuNzQyMjhaTTguMTQyODYgMTQuOTI4N0gxMy44NTcxQzE0LjI1IDE0LjkyODcgMTQuNTg2NCAxNC43ODg5IDE0Ljg2NjQgMTQuNTA5NEMxNS4xNDY0IDE0LjIyOTkgMTUuMjg2MiAxMy44OTM1IDE1LjI4NTcgMTMuNTAwMVYxMS4zNTczSDYuNzE0MjlWMTMuNTAwMUM2LjcxNDI5IDEzLjg5MyA2Ljg1NDI5IDE0LjIyOTQgNy4xMzQyOSAxNC41MDk0QzcuNDE0MjkgMTQuNzg5NCA3Ljc1MDQ4IDE0LjkyOTIgOC4xNDI4NiAxNC45Mjg3WiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K'

          switch(category) {
            case 'RECORD':
                return record
              case 'NORMAL_RESTAURANT':
                  return food
              case 'HOT_PLACE':
                  return hotPlace
              case 'LEISURE_SPORTS':
                  return lesureSports
              case 'NATURE':
                  return nature
              case 'THEME':
                  return park
              case 'SPECIAL_RESTAURANT':
                  return star
              case 'TOURIST_SPOT':
                  return tour
              case 'TOILET':
                  return toilet
              case 'PARKING':
                  return parking
          }
      }


    /**
     * 카테고리 코드를 카테고리 명으로 변경
     */
    function codeToName(code) {
      switch (code) {
          case 'NORMAL_RESTAURANT':
              return '일반 맛집'
          case 'SPECIAL_RESTAURANT':
              return '특별 맛집'
          case 'TOURIST_SPOT':
              return '관광지'
          case 'THEME':
              return '테마'
          case 'HOT_PLACE':
              return '핫플'
          case 'NATURE':
              return '자연'
          case 'LEISURE_SPORTS':
              return '레포츠'
          case 'RECORD':
              return '기록'
          default:
              return code
      }
    }

    /**
     * 오버레이 클릭 함수
     */
    function handleOverlayClick({ lng, lat, level, category, id, type, types }) {
    if(level > 1) {
        moveMap({ lng: lng, lat: lat, level: level-1 })
    } else {
        if(category !== 'TOILET' && category !== 'PARKING') {
            if(category.indexOf(",") === -1) {
                // 단일 아이템일 경우 type을 전송
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'overlayClick', data: { type: type, id: id } }))
            } else {
                let items = ''
                const categories = category.split(",")
                const ids = id.split(",")
                const typesArray = types.split(",") // types를 배열로 분리

                for (let i = 0; i < categories.length; i++) {
                    if(categories[i] !== 'TOILET' && categories[i] !== 'PARKING') {
                        items += '<div onclick="handleInfowindowClick(\\'' + ids[i] + '\\', \\'' + typesArray[i] + '\\')" style="padding: 5px 10px;"><a href="javascript:void(0);">' + codeToName(categories[i]) + '(' + ids[i] + ')</a></div>'
                    }
                }

                const iwContent = '<div style="max-height: 100px; overflow-y: scroll;">' + items + '</div>'

                const infowindow = new kakao.maps.InfoWindow({
                    position : new kakao.maps.LatLng(lat, lng), 
                    content : iwContent,
                })

                infowindows.push(infowindow)

                showInfowindows()
            }
        } 
    }
    }


    /**
    * 장소 오버레이 생성 함수
    */
    function settingPlaceOverlays(category, response) {
    initOverlays();

    const data = response;
    const level = map.getLevel();

    if (level <= 3) {
        // 클러스터링 해제 - 개별 오버레이 표시
        data.forEach((item) => {
        const overlay = createSingleOverlay(item, category, level);
        showingOverlays.push(overlay);
        overlay.setMap(map);
        });
    } else {
        const clusters = {};

        data.forEach((d) => {
        const key = getClusterKey(new kakao.maps.LatLng(d.lat, d.lng));

        if (!clusters[key]) {
            clusters[key] = [];
        }

        clusters[key].push(d);
        });

        for (const key in clusters) {
        const items = clusters[key];
        const overlay = createOverlay(items, category, level);
        showingOverlays.push(overlay);
        overlay.setMap(map);
        }
    }
    }


    function createOverlay(items, category, level) {
        if (items.length === 1) {
            return createSingleOverlay(items[0], category, level)
        } else {
            return createClusteredOverlay(items, category, level)
        }
    }

    /**
     * 단일 오버레이 생성 함수
     */
    function createSingleOverlay(item, category, level) {
    const imageUrl = getOverlayImage(item.category);
    const content = '<div class="single-overlay" onClick="handleOverlayClick({ lng: ' + item.lng + ', lat: ' + item.lat + ', level: ' + level + ', category: \\\'' + item.category + '\\\', id: \\\'' + item.title + '\\\', type: \\\'' + item.type + '\\\' })">' +
        '<div class="icons">' +
            '<img class="icon" src="' + imageUrl + '" style="left:0;" />' +
        '</div>' +
    '</div>';

    return new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(item.lat, item.lng),
        content: content,
        yAnchor: getAnchorY(level),
        xAnchor: 0
    });
    }



    /**
     * 클러스터 오버레이 생성 함수
     */
    function createClusteredOverlay(items, category, level) {
    let sumLat = 0;
    let sumLng = 0;
    let keys = '';
    let categories = '';
    let types = '';
    const uniqueCategories = new Set();

    for (const item of items) {
        keys += item.title + ',';
        categories += item.category + ',';
        types += item.type + ',';
        sumLat += item.lat;
        sumLng += item.lng;
        uniqueCategories.add(item.category);
    }
    keys = keys.slice(0, -1);
    categories = categories.slice(0, -1);
    types = types.slice(0, -1);

    const position = new kakao.maps.LatLng(sumLat / items.length, sumLng / items.length);

    let imagesHtml = '';
    const categoryArray = Array.from(uniqueCategories);

    if (uniqueCategories.size === 1) {
        const imageUrl = getOverlayImage(categoryArray[0]);
        imagesHtml += '<img class="icon" src="' + imageUrl + '" style="left:0;" />';
    } else {
        categoryArray.forEach((category, index) => {
            const imageUrl = getOverlayImage(category);
            imagesHtml += '<img class="icon" src="' + imageUrl + '" style="left:' + (index * 15) + 'px; z-index:' + (categoryArray.length - index) + ';" />';
        });
    }

    let countHtml = '<div class="count" style="margin-left:' + ((categoryArray.length - 1) * 15 + 35) + 'px;">+' + items.length + '</div>';

    const content = '<div class="group-overlay" onClick="handleOverlayClick({ lng: ' + position.getLng() + ', lat: ' + position.getLat() + ', level: ' + level + ', category: \\\'' + categories + '\\\', id: \\\'' + keys + '\\\', types: \\\'' + types + '\\\' })">' +
        '<div class="icons">' +
            imagesHtml +
            countHtml +
        '</div>' +
        '<div class="arrow"></div>' +
    '</div>';

    return new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: getAnchorY(level),
        xAnchor: 0
    });
    }

    /**
     * 이미지 오버레이 생성 함수
     */
    function settingImageOverlays(response) {
        initOverlays();

        const data = response;
        const level = map.getLevel();

        if (level <= 3) {
            // 클러스터링 해제 - 개별 오버레이 표시
            data.forEach((item) => {
                const overlay = createSingleImageOverlay(item, level);
                showingOverlays.push(overlay);
                overlay.setMap(map);
            });
        } else {
            const clusters = {};

            data.forEach((d) => {
                const key = getClusterKey(new kakao.maps.LatLng(d.lat, d.lng));

                if (!clusters[key]) {
                    clusters[key] = [];
                }

                clusters[key].push(d);
            });

            for (const key in clusters) {
                const items = clusters[key];
                const overlay = createClusteredImageOverlay(items, level);
                showingOverlays.push(overlay);
                overlay.setMap(map);
            }
        }
    }

    /**
     * 단일 이미지 오버레이 생성 함수
     */
    function createSingleImageOverlay(item, level) {
        const imageUrl = getOverlayImage('RECORD');
        const content = '<div class="single-overlay" onClick="handleOverlayClick({ lng: ' + item.lng +
            ', lat: ' + item.lat +
            ', level: ' + level +
            ', category: \\\'' + item.category + '\\\', id: \\\'' + item.id + '\\\' })">' +
            '<div class="icons">' +
                '<img class="icon" src="' + imageUrl + '" alt="Marker"/>' +
            '</div>' +
        '</div>';

        return new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(item.lat, item.lng),
            content: content,
            yAnchor: getAnchorY(level),
            xAnchor: 0,
        });
    }


    /**
     * 클러스터 이미지 오버레이 생성 함수
     */
    function createClusteredImageOverlay(items, level) {
        let sumLat = 0;
        let sumLng = 0;
        let ids = '';
        let categories = '';
        let imagesHtml = '';
        let imageCount = Math.min(items.length, 5);

        const imageUrl = getOverlayImage('RECORD');

        for (let i = 0; i < imageCount; i++) {
            const item = items[i];
            sumLat += item.lat;
            sumLng += item.lng;

            imagesHtml += '<img src="' + imageUrl + '" class="icon" style="left:' + (i * 15) +
                'px; z-index:' + (imageCount - i) + ';"/>';
        }

        items.forEach((item) => {
            ids += item.id + ',';
            categories += item.category + ',';
        });
        ids = ids.slice(0, -1);
        categories = categories.slice(0, -1);

        const position = new kakao.maps.LatLng(sumLat / items.length, sumLng / items.length);
        const countHtml = '<div class="count" style="margin-left:' +
            ((imageCount - 1) * 15 + 35) + 'px;">+' + items.length + '</div>';

        const content = '<div class="group-overlay" onClick="handleOverlayClick({ lng: ' +
            position.getLng() + ', lat: ' + position.getLat() +
            ', level: ' + level +
            ', category: \\\'' + categories + '\\\', id: \\\'' + ids + '\\\' })">' +
            '<div class="icons">' +
                imagesHtml +
                countHtml +
            '</div>' +
            '<div class="arrow"></div>' +
        '</div>';

        return new kakao.maps.CustomOverlay({
            position: position,
            content: content,
            yAnchor: getAnchorY(level),
            xAnchor: 0,
        });
    }
    </script>
  </body>
  </html>
`

export default map
