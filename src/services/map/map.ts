/**
 * 지도 생성 함수
 */
const createMap = `
  const container = document.getElementById('map')
  const options = {
      center: new kakao.maps.LatLng(lat, lng),
      maxLevel: 10,
  }

  map = new kakao.maps.Map(container, options)
`

/**
 * 지도 이동 함수
 */
const moveMap = `
  const latlng = new kakao.maps.LatLng(lat, lng)

  map.setLevel(3)
  map.panTo(latlng)
`

/**
 * 교통 정보 추가 함수
 */
const showTrfficInfo = `
  if(isShow) {
    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC)
  } else {
    map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC)
  }
`

/**
 * 마커 초기화 함수
 */
const initMarkers = `
  markers.forEach(m => m.setMap(null))
  markers = []
`

/**
 * 마커 추가 함수
 */
const showMarkers = `
  markers.forEach(m => {
      m.setMap(map)
  })
`

/**
 * 오버레이 초기화 함수
 */
const initOverlays = `
  showingOverlays.forEach(m => m.setMap(null))
  showingOverlays = []
`

/**
 * 오버레이 추가 함수
 */
const showOverlays = `
  showingOverlays.forEach(m => {
      m.setMap(map)
  })
`

/**
 * 오버레이 이미지 선택 함수
 */
const getOverlayImage = `
  const food = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjODE2RTY4Ii8+DQo8cGF0aCBkPSJNNS40NjE0MiA5LjE2MjE5VjkuMTUzODlDNS40NjE0IDguMzMzMzMgNS43MDQ0MiA3LjUzMTE1IDYuMTU5ODEgNi44NDg1NkM2LjYxNTIgNi4xNjU5NiA3LjI2MjU2IDUuNjMzNTQgOC4wMjAyMSA1LjMxODQ1QzguNzc3ODYgNS4wMDMzNiA5LjYxMTg2IDQuOTE5NzMgMTAuNDE3IDUuMDc4MTFDMTEuMjIyMSA1LjIzNjQ5IDExLjk2MjMgNS42Mjk3OCAxMi41NDQxIDYuMjA4MzZDMTMuMDAyIDUuOTgyNDEgMTMuNTEzMyA1Ljg4NzQgMTQuMDIxNyA1LjkzMzg1QzE0LjUzMDEgNS45ODAyOSAxNS4wMTU4IDYuMTY2MzggMTUuNDI1MSA2LjQ3MTU1QzE1LjgzNDQgNi43NzY3MiAxNi4xNTEzIDcuMTg5MSAxNi4zNDA5IDcuNjYzMTFDMTYuNTMwNSA4LjEzNzEzIDE2LjU4NTQgOC42NTQzMyAxNi40OTk1IDkuMTU3NThDMTYuNjI1OCA5LjE2OTMgMTYuNzQ4NCA5LjIwNjkzIDE2Ljg1OTUgOS4yNjgxMkMxNi45NzA2IDkuMzI5MzEgMTcuMDY3OSA5LjQxMjc1IDE3LjE0NTMgOS41MTMyMkMxNy4yMjI4IDkuNjEzNyAxNy4yNzg3IDkuNzI5MDUgMTcuMzA5NSA5Ljg1MjA5QzE3LjM0MDQgOS45NzUxMyAxNy4zNDU2IDEwLjEwMzIgMTcuMzI0NyAxMC4yMjgzQzE2LjkwNzUgMTIuNzM4MiAxNS44NzU1IDE0LjMyNjggMTQuMjMwNiAxNC45OTUxVjE1LjYxNTRDMTQuMjMwNiAxNS45ODI2IDE0LjA4NDcgMTYuMzM0OCAxMy44MjUxIDE2LjU5NDVDMTMuNTY1NCAxNi44NTQxIDEzLjIxMzIgMTcgMTIuODQ2IDE3SDkuMTUzN0M4Ljc4NjQ4IDE3IDguNDM0MyAxNi44NTQxIDguMTc0NjQgMTYuNTk0NUM3LjkxNDk3IDE2LjMzNDggNy43NjkxIDE1Ljk4MjYgNy43NjkxIDE1LjYxNTRWMTQuOTk1MUM2LjEyNDE4IDE0LjMyNjggNS4wOTIxOSAxMi43MzgyIDQuNjc0OTYgMTAuMjI4M0M0LjY1NDgyIDEwLjEwNjUgNC42NTkzMiA5Ljk4MTkzIDQuNjg4MiA5Ljg2MTlDNC43MTcwNyA5Ljc0MTg2IDQuNzY5NzMgOS42Mjg4NCA0Ljg0MzA2IDkuNTI5NTJDNC45MTYzOSA5LjQzMDIgNS4wMDg5IDkuMzQ2NiA1LjExNTExIDkuMjgzNjZDNS4yMjEzMiA5LjIyMDczIDUuMzM5MDggOS4xNzk3NCA1LjQ2MTQyIDkuMTYzMTJWOS4xNjIxOVpNNi4zODQ0OSA5LjE1Mzg5SDcuMzA3NTZDNy4zMDc1NiA4LjU0MTg1IDcuNTUwNjkgNy45NTQ4OCA3Ljk4MzQ2IDcuNTIyMTFDOC40MTYyNCA3LjA4OTM0IDkuMDAzMjEgNi44NDYyMSA5LjYxNTI0IDYuODQ2MjFDMTAuMjI3MyA2Ljg0NjIxIDEwLjgxNDIgNy4wODkzNCAxMS4yNDcgNy41MjIxMUMxMS42Nzk4IDcuOTU0ODggMTEuOTIyOSA4LjU0MTg1IDExLjkyMjkgOS4xNTM4OUgxMi44NDZDMTIuODQ2IDguMjk3MDQgMTIuNTA1NiA3LjQ3NTI4IDExLjg5OTcgNi44Njk0QzExLjI5MzggNi4yNjM1MiAxMC40NzIxIDUuOTIzMTMgOS42MTUyNCA1LjkyMzEzQzguNzU4MzkgNS45MjMxMyA3LjkzNjY0IDYuMjYzNTIgNy4zMzA3NSA2Ljg2OTRDNi43MjQ4NyA3LjQ3NTI4IDYuMzg0NDkgOC4yOTcwNCA2LjM4NDQ5IDkuMTUzODlaTTguMjMwNjMgOS4xNTM4OUgxMC45OTk4QzEwLjk5OTggOC43ODY2NiAxMC44NTQgOC40MzQ0OCAxMC41OTQzIDguMTc0ODJDMTAuMzM0NiA3LjkxNTE2IDkuOTgyNDYgNy43NjkyOCA5LjYxNTI0IDcuNzY5MjhDOS4yNDgwMiA3Ljc2OTI4IDguODk1ODQgNy45MTUxNiA4LjYzNjE3IDguMTc0ODJDOC4zNzY1MSA4LjQzNDQ4IDguMjMwNjMgOC43ODY2NiA4LjIzMDYzIDkuMTUzODlaTTE0LjU2ODQgOS4xNTM4OUgxNS41NTcxQzE1LjYyNjcgOC44ODEwOSAxNS42MzMyIDguNTk1OTkgMTUuNTc2MSA4LjMyMDMxQzE1LjUxODkgOC4wNDQ2MiAxNS4zOTk1IDcuNzg1NjMgMTUuMjI3MSA3LjU2MzA2QzE1LjA1NDYgNy4zNDA1IDE0LjgzMzYgNy4xNjAyMyAxNC41ODEgNy4wMzZDMTQuMzI4MyA2LjkxMTc3IDE0LjA1MDYgNi44NDY4NiAxMy43NjkxIDYuODQ2MjFDMTMuNTQ3NSA2Ljg0NjIxIDEzLjMzNzEgNi44ODQ5NyAxMy4xNDE0IDYuOTU2MDVDMTMuMzA0OCA3LjIxODIgMTMuNDM5NSA3LjUwMDY2IDEzLjU0MjkgNy43OTY5N0MxMy43MTg3IDcuNzUzMzYgMTMuOTAzNSA3Ljc2MjM0IDE0LjA3NDIgNy44MjI3OUMxNC4yNDUgNy44ODMyNCAxNC4zOTQyIDcuOTkyNSAxNC41MDM1IDguMTM3MDFDMTQuNjEyNyA4LjI4MTUyIDE0LjY3NzEgOC40NTQ5MiAxNC42ODg2IDguNjM1NjlDMTQuNzAwMiA4LjgxNjQ2IDE0LjY1ODQgOC45OTY2NSAxNC41Njg0IDkuMTUzODlaTTEzLjMwNzUgMTUuMTUzOUg4LjY5MjE3VjE1LjYxNTRDOC42OTIxNyAxNS43Mzc4IDguNzQwNzkgMTUuODU1MiA4LjgyNzM1IDE1Ljk0MTdDOC45MTM5IDE2LjAyODMgOS4wMzEzIDE2LjA3NjkgOS4xNTM3IDE2LjA3NjlIMTIuODQ2QzEyLjk2ODQgMTYuMDc2OSAxMy4wODU4IDE2LjAyODMgMTMuMTcyMyAxNS45NDE3QzEzLjI1ODkgMTUuODU1MiAxMy4zMDc1IDE1LjczNzggMTMuMzA3NSAxNS42MTU0VjE1LjE1MzlaTTguMzY3MjUgMTQuMjMwOEgxMy42MzI1QzE1LjA5NjQgMTMuNzYgMTYuMDIzMiAxMi40Mjg5IDE2LjQxNDYgMTAuMDc3SDUuNTg1MTFDNS45NzY0OSAxMi40Mjg5IDYuOTAzMjUgMTMuNzYgOC4zNjcyNSAxNC4yMzA4WiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K'
  const hotPlace = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjQTIwODA1Ii8+DQo8cGF0aCBkPSJNMTUuMDUgMTAuNDI4OEMxNC44ODU3IDEwLjIxNDYgMTQuNjg1NyAxMC4wMjg5IDE0LjUwMDEgOS44NDMyMkMxNC4wMjE2IDkuNDE0NzIgMTMuNDc4OCA5LjEwNzY0IDEzLjAyMTggOC42NTc3MkMxMS45NTc3IDcuNjE1MDUgMTEuNzIyIDUuODkzOTQgMTIuNDAwNCA0LjU3Mjc1QzExLjcyMiA0LjczNzAxIDExLjEyOTIgNS4xMDgzNyAxMC42MjIyIDUuNTE1NDRDOC43NzI1MyA3LjAwMDg4IDguMDQ0MDkgOS42MjE4MyA4LjkxNTM2IDExLjg3MTRDOC45NDM5MyAxMS45NDI4IDguOTcyNSAxMi4wMTQyIDguOTcyNSAxMi4xMDcxQzguOTcyNSAxMi4yNjQyIDguODY1MzcgMTIuNDA3IDguNzIyNTQgMTIuNDY0MkM4LjU1ODI5IDEyLjUzNTYgOC4zODY4OSAxMi40OTI3IDguMjUxMiAxMi4zNzg1QzguMjEwNjcgMTIuMzQ0NSA4LjE3Njc3IDEyLjMwMzQgOC4xNTEyMiAxMi4yNTcxQzcuMzQ0MjIgMTEuMjM1OCA3LjIxNTY3IDkuNzcxOCA3Ljc1ODQzIDguNjAwNTlDNi41NjU3OSA5LjU3MTg0IDUuOTE1OTEgMTEuMjE0NCA2LjAwODc1IDEyLjc2NDFDNi4wNTE2IDEzLjEyMTIgNi4wOTQ0NSAxMy40NzgzIDYuMjE1ODYgMTMuODM1M0M2LjMxNTg0IDE0LjI2MzggNi41MDg2NiAxNC42OTIzIDYuNzIyOTEgMTUuMDcwOEM3LjQ5NDIgMTYuMzA2MyA4LjgyOTY3IDE3LjE5MTkgMTAuMjY1MSAxNy4zNzA0QzExLjc5MzQgMTcuNTYzMiAxMy40Mjg4IDE3LjI4NDcgMTQuNiAxNi4yMjc4QzE1LjkwNjkgMTUuMDQyMyAxNi4zNjQgMTMuMTQyNiAxNS42OTI3IDExLjUxNDNMMTUuNTk5OSAxMS4zMjg3QzE1LjQ0OTkgMTEuMDAwMSAxNS4wNSAxMC40Mjg4IDE1LjA1IDEwLjQyODhaTTEyLjc5MzIgMTQuOTI4QzEyLjU5MzMgMTUuMDk5NCAxMi4yNjQ4IDE1LjI4NTEgMTIuMDA3NyAxNS4zNTY1QzExLjIwNzggMTUuNjQyMiAxMC40MDc5IDE1LjI0MjIgOS45MzY2MSAxNC43NzA5QzEwLjc4NjQgMTQuNTcwOSAxMS4yOTM1IDEzLjk0MjUgMTEuNDQzNSAxMy4zMDY5QzExLjU2NDkgMTIuNzM1NSAxMS4zMzYzIDEyLjI2NDIgMTEuMjQzNSAxMS43MTQzQzExLjE1NzggMTEuMTg1OCAxMS4xNzIxIDEwLjczNTkgMTEuMzY0OSAxMC4yNDMxQzExLjUwMDYgMTAuNTE0NSAxMS42NDM0IDEwLjc4NTkgMTEuODE0OCAxMS4wMDAxQzEyLjM2NDcgMTEuNzE0MyAxMy4yMjg5IDEyLjAyODUgMTMuNDE0NSAxMi45OTk4QzEzLjQ0MzEgMTMuMDk5OCAxMy40NTc0IDEzLjE5OTcgMTMuNDU3NCAxMy4zMDY5QzEzLjQ3ODggMTMuODkyNSAxMy4yMjE3IDE0LjUzNTIgMTIuNzkzMiAxNC45MjhaIiBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+DQo='
  const lesureSports = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjNTg4NEVGIi8+DQo8cGF0aCBkPSJNNS42NjY2NyA4SDEzLjY2NjdDMTMuODQzNSA4IDE0LjAxMyA4LjA3MDI0IDE0LjEzODEgOC4xOTUyNkMxNC4yNjMxIDguMzIwMjkgMTQuMzMzMyA4LjQ4OTg2IDE0LjMzMzMgOC42NjY2N1YxMS42NjY3QzE0LjMzMzMgMTIuMTA4NyAxNC4xNTc3IDEyLjUzMjYgMTMuODQ1MiAxMi44NDUyQzEzLjUzMjYgMTMuMTU3NyAxMy4xMDg3IDEzLjMzMzMgMTIuNjY2NyAxMy4zMzMzSDEyLjMzMzNDMTEuOTc5NyAxMy4zMzMzIDExLjY0MDYgMTMuMTkyOSAxMS4zOTA1IDEyLjk0MjhDMTEuMTQwNSAxMi42OTI4IDExIDEyLjM1MzYgMTEgMTJDMTEgMTEuNjQ2NCAxMC44NTk1IDExLjMwNzIgMTAuNjA5NSAxMS4wNTcyQzEwLjM1OTQgMTAuODA3MSAxMC4wMjAzIDEwLjY2NjcgOS42NjY2NyAxMC42NjY3QzkuMzEzMDQgMTAuNjY2NyA4Ljk3MzkxIDEwLjgwNzEgOC43MjM4NiAxMS4wNTcyQzguNDczODEgMTEuMzA3MiA4LjMzMzMzIDExLjY0NjQgOC4zMzMzMyAxMkM4LjMzMzMzIDEyLjM1MzYgOC4xOTI4NiAxMi42OTI4IDcuOTQyODEgMTIuOTQyOEM3LjY5Mjc2IDEzLjE5MjkgNy4zNTM2MiAxMy4zMzMzIDcgMTMuMzMzM0g2LjY2NjY3QzYuMjI0NjQgMTMuMzMzMyA1LjgwMDcyIDEzLjE1NzcgNS40ODgxNiAxMi44NDUyQzUuMTc1NTkgMTIuNTMyNiA1IDEyLjEwODcgNSAxMS42NjY3VjguNjY2NjdDNSA4LjQ4OTg2IDUuMDcwMjQgOC4zMjAyOSA1LjE5NTI2IDguMTk1MjZDNS4zMjAyOSA4LjA3MDI0IDUuNDg5ODYgOCA1LjY2NjY3IDhaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuMzMzMzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTkuNjY2NzUgMTQuNjY2N0M5LjY2Njc1IDE1LjAyMDMgOS44MDcyMiAxNS4zNTk0IDEwLjA1NzMgMTUuNjA5NUMxMC4zMDczIDE1Ljg1OTUgMTAuNjQ2NSAxNiAxMS4wMDAxIDE2SDEzLjMzMzRDMTQuMzA1OSAxNiAxNS4yMzg1IDE1LjYxMzcgMTUuOTI2MSAxNC45MjYxQzE2LjYxMzggMTQuMjM4NCAxNy4wMDAxIDEzLjMwNTggMTcuMDAwMSAxMi4zMzMzVjYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS4zMzMzMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L3N2Zz4NCg=='
  const nature = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjMjA4ODZEIi8+DQo8cGF0aCBkPSJNMTAuNzAwOSA1LjQxNzM0TDcuMzgzOTMgOS4wNjY4OUM3LjI5Njg4IDkuMTYwNjQgNy4yNSA5LjI4NTY0IDcuMjUgOS40MTI4OEM3LjI1IDkuNjk4NTkgNy40Nzk5MSA5LjkyODUgNy43NjU2MiA5LjkyODVIOC4zMjE0M0w2LjY4MzA0IDExLjU2NjlDNi41ODkyOSAxMS42NjA2IDYuNTM1NzEgMTEuNzkwMSA2LjUzNTcxIDExLjkyNEM2LjUzNTcxIDEyLjIwMzEgNi43NjExNiAxMi40Mjg1IDcuMDQwMTggMTIuNDI4NUg3Ljc4NTcxTDYuMTIwNTQgMTQuNDI2M0M2LjA0MjQxIDE0LjUyIDYgMTQuNjM4MyA2IDE0Ljc2MTFDNiAxNS4wNTEzIDYuMjM0MzggMTUuMjg1NiA2LjUyNDU1IDE1LjI4NTZIMTAuMjg1N1YxNS45OTk5QzEwLjI4NTcgMTYuMzk1IDEwLjYwNDkgMTYuNzE0MiAxMSAxNi43MTQyQzExLjM5NTEgMTYuNzE0MiAxMS43MTQzIDE2LjM5NSAxMS43MTQzIDE1Ljk5OTlWMTUuMjg1NkgxNS40NzU0QzE1Ljc2NTYgMTUuMjg1NiAxNiAxNS4wNTEzIDE2IDE0Ljc2MTFDMTYgMTQuNjM4MyAxNS45NTc2IDE0LjUyIDE1Ljg3OTUgMTQuNDI2M0wxNC4yMTQzIDEyLjQyODVIMTQuOTU5OEMxNS4yMzg4IDEyLjQyODUgMTUuNDY0MyAxMi4yMDMxIDE1LjQ2NDMgMTEuOTI0QzE1LjQ2NDMgMTEuNzkwMSAxNS40MTA3IDExLjY2MDYgMTUuMzE3IDExLjU2NjlMMTMuNjc4NiA5LjkyODVIMTQuMjM0NEMxNC41MTc5IDkuOTI4NSAxNC43NSA5LjY5ODU5IDE0Ljc1IDkuNDEyODhDMTQuNzUgOS4yODU2NCAxNC43MDMxIDkuMTYwNjQgMTQuNjE2MSA5LjA2Njg5TDExLjI5OTEgNS40MTczNEMxMS4yMjMyIDUuMzMyNTIgMTEuMTEzOCA1LjI4NTY0IDExIDUuMjg1NjRDMTAuODg2MiA1LjI4NTY0IDEwLjc3NjggNS4zMzI1MiAxMC43MDA5IDUuNDE3MzRaIiBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+DQo='
  const park = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjRUY4RkFBIi8+DQo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjk5OTMgNC41QzExLjI2NjYgNC40OTk5NiAxMS41MzA1IDQuNTU5ODUgMTEuNzcxNiA0LjY3NTI3QzEyLjAxMjcgNC43OTA2OSAxMi4yMjQ4IDQuOTU4NyAxMi4zOTI0IDUuMTY2OTNDMTIuNTYgNS4zNzUxNyAxMi42Nzg4IDUuNjE4MzQgMTIuNzQgNS44Nzg1M0MxMi44MDExIDYuMTM4NzMgMTIuODAzMiA2LjQwOTM0IDEyLjc0NiA2LjY3MDQ0QzEyLjk3OTIgNi43NzgxMSAxMy4xOTk3IDYuOTA1NDQgMTMuNDA3NSA3LjA1MjQ0QzEzLjYwNTEgNi44NzI2OCAxMy44NDA0IDYuNzM5NDggMTQuMDk2MyA2LjY2MjYyQzE0LjM1MjEgNi41ODU3NiAxNC42MjE5IDYuNTY3MjEgMTQuODg1OCA2LjYwODMxQzE1LjE0OTggNi42NDk0MiAxNS40MDExIDYuNzQ5MTUgMTUuNjIxNSA2LjkwMDE3QzE1Ljg0MTggNy4wNTExOCAxNi4wMjU1IDcuMjQ5NjUgMTYuMTU5IDcuNDgwOTlDMTYuMjkyNiA3LjcxMjMyIDE2LjM3MjYgNy45NzA2NCAxNi4zOTMyIDguMjM2OTZDMTYuNDEzOCA4LjUwMzI4IDE2LjM3NDUgOC43NzA4NCAxNi4yNzgxIDkuMDE5OTZDMTYuMTgxNyA5LjI2OTA4IDE2LjAzMDcgOS40OTM0NCAxNS44MzYyIDkuNjc2NTVDMTUuNjQxOCA5Ljg1OTY1IDE1LjQwODcgOS45OTY4NiAxNS4xNTQyIDEwLjA3ODFDMTUuMTc3NSAxMC4zMzE4IDE1LjE3NzUgMTAuNTg3MSAxNS4xNTQyIDEwLjg0MDlDMTUuNDA4OCAxMC45MjIgMTUuNjQyIDExLjA1OTEgMTUuODM2NiAxMS4yNDIyQzE2LjAzMTIgMTEuNDI1MiAxNi4xODIzIDExLjY0OTYgMTYuMjc4OCAxMS44OTg3QzE2LjM3NTMgMTIuMTQ3OSAxNi40MTQ3IDEyLjQxNTUgMTYuMzk0MSAxMi42ODE4QzE2LjM3MzYgMTIuOTQ4MiAxNi4yOTM2IDEzLjIwNjYgMTYuMTYwMSAxMy40MzhDMTYuMDI2NSAxMy42Njk0IDE1Ljg0MjggMTMuODY4IDE1LjYyMjQgMTQuMDE5QzE1LjQwMjEgMTQuMTcwMSAxNS4xNTA2IDE0LjI2OTggMTQuODg2NyAxNC4zMTA5QzE0LjYyMjcgMTQuMzUyIDE0LjM1MjggMTQuMzMzNSAxNC4wOTY5IDE0LjI1NjVDMTMuODQxMSAxNC4xNzk2IDEzLjYwNTcgMTQuMDQ2NCAxMy40MDgxIDEzLjg2NjVDMTMuMjkzNyAxMy45NDY4IDEzLjE3NjEgMTQuMDIxNSAxMy4wNTUzIDE0LjA5MDZMMTIuODcwNiAxNC4xODg5TDEzLjM1MjcgMTUuNjM0N0MxMy40MDAyIDE1Ljc3ODggMTMuMzkwOSAxNS45MzU2IDEzLjMyNjggMTYuMDczMUMxMy4yNjI3IDE2LjIxMDYgMTMuMTQ4NSAxNi4zMTg0IDEzLjAwNzYgMTYuMzc0N0MxMi44NjY3IDE2LjQzMDkgMTIuNzA5NiAxNi40MzEzIDEyLjU2ODUgMTYuMzc1N0MxMi40MjczIDE2LjMyMDIgMTIuMzEyNiAxNi4yMTI5IDEyLjI0NzggMTYuMDc1N0wxMi4yMjE2IDE2LjAxMTNMMTEuNzQwMSAxNC41NjU2QzExLjMxMSAxNC42NDMgMTAuODcyNCAxNC42NTI2IDEwLjQ0MDMgMTQuNTk0MkwxMC4yNTg1IDE0LjU2NTZMOS43NzcwMSAxNi4wMTEzQzkuNzI5MjEgMTYuMTU1OSA5LjYyNzg3IDE2LjI3NjggOS40OTM3NyAxNi4zNDlDOS4zNTk2OCAxNi40MjEyIDkuMjAzMDIgMTYuNDM5NCA5LjA1NTk3IDE2LjM5OTdDOC45MDg5MiAxNi4zNiA4Ljc4MjYzIDE2LjI2NTYgOC43MDMwNSAxNi4xMzU3QzguNjIzNDYgMTYuMDA1OSA4LjU5NjYxIDE1Ljg1MDUgOC42MjgwMiAxNS43MDE0TDguNjQ1OSAxNS42MzQ3TDkuMTI4MDIgMTQuMTg4OUM4Ljk0MTQzIDE0LjA5NTIgOC43NjIxNSAxMy45ODc2IDguNTkxNjcgMTMuODY3MUM4LjM5NDA5IDE0LjA0NyA4LjE1ODcxIDE0LjE4MDIgNy45MDI4NSAxNC4yNTcxQzcuNjQ2OTggMTQuMzM0MSA3LjM3NzEzIDE0LjM1MjYgNy4xMTMxMyAxNC4zMTE1QzYuODQ5MTQgMTQuMjcwNCA2LjU5NzcxIDE0LjE3MDcgNi4zNzczNCAxNC4wMTk2QzYuMTU2OTcgMTMuODY4NiA1Ljk3MzI1IDEzLjY3IDUuODM5NzEgMTMuNDM4NkM1LjcwNjE2IDEzLjIwNzIgNS42MjYxOCAxMi45NDg4IDUuNjA1NjMgMTIuNjgyNEM1LjU4NTA5IDEyLjQxNjEgNS42MjQ1MiAxMi4xNDg1IDUuNzIxIDExLjg5OTNDNS44MTc0OSAxMS42NTAyIDUuOTY4NiAxMS40MjU4IDYuMTYzMiAxMS4yNDI4QzYuMzU3ODEgMTEuMDU5NyA2LjU5MDk3IDEwLjkyMjYgNi44NDU1NCAxMC44NDE1QzYuODIyMDEgMTAuNTg3NiA2LjgyMTgxIDEwLjMzMiA2Ljg0NDk0IDEwLjA3ODFDNi41OTA0NyA5Ljk5Njg2IDYuMzU3NDMgOS44NTk2NSA2LjE2Mjk1IDkuNjc2NTVDNS45Njg0NyA5LjQ5MzQ0IDUuODE3NDkgOS4yNjkwOCA1LjcyMTEgOS4wMTk5NkM1LjYyNDcyIDguNzcwODQgNS41ODUzOSA4LjUwMzI4IDUuNjA1OTkgOC4yMzY5NkM1LjYyNjU5IDcuOTcwNjQgNS43MDY2MSA3LjcxMjMyIDUuODQwMTYgNy40ODA5OUM1Ljk3MzcxIDcuMjQ5NjUgNi4xNTc0IDcuMDUxMTggNi4zNzc3MyA2LjkwMDE3QzYuNTk4MDYgNi43NDkxNSA2Ljg0OTQzIDYuNjQ5NDIgNy4xMTMzNyA2LjYwODMxQzcuMzc3MzEgNi41NjcyMSA3LjY0NzEgNi41ODU3NiA3LjkwMjkyIDYuNjYyNjJDOC4xNTg3NCA2LjczOTQ4IDguMzk0MDkgNi44NzI2OCA4LjU5MTY3IDcuMDUyNDRDOC43OTk4MyA2LjkwNTE4IDkuMDIxMDYgNi43NzczMSA5LjI1MjU3IDYuNjcwNDRDOS4xOTUzNyA2LjQwOTM0IDkuMTk3NDQgNi4xMzg3MyA5LjI1ODY0IDUuODc4NTNDOS4zMTk4MyA1LjYxODM0IDkuNDM4NTkgNS4zNzUxNyA5LjYwNjE4IDUuMTY2OTNDOS43NzM3NiA0Ljk1ODcgOS45ODU5MSA0Ljc5MDY5IDEwLjIyNyA0LjY3NTI3QzEwLjQ2ODEgNC41NTk4NSAxMC43MzIgNC40OTk5NiAxMC45OTkzIDQuNVpNMTAuOTk5MyAxMi4zNDM5TDEwLjY0MTcgMTMuNDE4NEMxMC44NzkyIDEzLjQ0NzEgMTEuMTE5MyAxMy40NDcxIDExLjM1NjkgMTMuNDE4NEwxMC45OTkzIDEyLjM0MzlaTTcuOTAyNzUgMTIuMjQ3M0M3Ljg2MzkxIDEyLjE3OSA3LjgxMTkzIDEyLjExOSA3Ljc0OTgyIDEyLjA3MDlDNy42ODc3IDEyLjAyMjcgNy42MTY2OCAxMS45ODczIDcuNTQwODMgMTEuOTY2N0M3LjQ2NDk4IDExLjk0NjEgNy4zODU4MSAxMS45NDA4IDcuMzA3ODcgMTEuOTUwOUM3LjIyOTkzIDExLjk2MSA3LjE1NDc3IDExLjk4NjUgNy4wODY3IDEyLjAyNThDNy4wMTg2NCAxMi4wNjUxIDYuOTU5MDIgMTIuMTE3NCA2LjkxMTI4IDEyLjE3OTlDNi44NjM1NCAxMi4yNDIzIDYuODI4NjIgMTIuMzEzNiA2LjgwODUzIDEyLjM4OTVDNi43ODg0NCAxMi40NjU1IDYuNzgzNTggMTIuNTQ0NyA2Ljc5NDIzIDEyLjYyMjZDNi44MDQ4OCAxMi43MDA1IDYuODMwODIgMTIuNzc1NSA2Ljg3MDU3IDEyLjg0MzNDNi45NTAxNiAxMi45NzkgNy4wODAyMiAxMy4wNzc4IDcuMjMyMzYgMTMuMTE4QzcuMzg0NSAxMy4xNTgyIDcuNTQ2MzggMTMuMTM2NyA3LjY4MjY3IDEzLjA1OEM3LjgxODk1IDEyLjk3OTMgNy45MTg1OCAxMi44NDk5IDcuOTU5ODEgMTIuNjk4QzguMDAxMDUgMTIuNTQ2MSA3Ljk4MDUzIDEyLjM4NDEgNy45MDI3NSAxMi4yNDczWk0xNC4wOTU4IDEyLjI0NzNDMTQuMDU2MSAxMi4zMTUxIDE0LjAzMDEgMTIuMzkwMSAxNC4wMTk1IDEyLjQ2OEMxNC4wMDg5IDEyLjU0NTkgMTQuMDEzNyAxMi42MjUxIDE0LjAzMzggMTIuNzAxQzE0LjA1MzkgMTIuNzc3IDE0LjA4ODggMTIuODQ4MyAxNC4xMzY2IDEyLjkxMDdDMTQuMTg0MyAxMi45NzMxIDE0LjI0MzkgMTMuMDI1NSAxNC4zMTIgMTMuMDY0OEMxNC4zOCAxMy4xMDQxIDE0LjQ1NTIgMTMuMTI5NiAxNC41MzMxIDEzLjEzOTdDMTQuNjExMSAxMy4xNDk4IDE0LjY5MDIgMTMuMTQ0NCAxNC43NjYxIDEzLjEyMzhDMTQuODQxOSAxMy4xMDMzIDE0LjkxMyAxMy4wNjc5IDE0Ljk3NTEgMTMuMDE5N0MxNS4wMzcyIDEyLjk3MTYgMTUuMDg5MiAxMi45MTE2IDE1LjEyOCAxMi44NDMzQzE1LjIwNTggMTIuNzA2NSAxNS4yMjYzIDEyLjU0NDQgMTUuMTg1MSAxMi4zOTI2QzE1LjE0MzggMTIuMjQwNyAxNS4wNDQyIDEyLjExMTMgMTQuOTA3OSAxMi4wMzI2QzE0Ljc3MTYgMTEuOTUzOSAxNC42MDk4IDExLjkzMjMgMTQuNDU3NiAxMS45NzI2QzE0LjMwNTUgMTIuMDEyOCAxNC4xNzU0IDEyLjExMTYgMTQuMDk1OCAxMi4yNDczWk0xMi4xMDU0IDcuNjkxODlDMTEuNzkwMiA3Ljk0MDM0IDExLjQwMDYgOC4wNzU1MiAxMC45OTkzIDguMDc1NjlDMTAuNTgxNSA4LjA3NTY5IDEwLjE5NzEgNy45MzI2NiA5Ljg5MjYyIDcuNjkxODlDOS42MjYyMyA3Ljc5OTE3IDkuMzc4MzIgNy45NDI3OSA5LjE1NjAzIDguMTE4QzkuMjEzNDMgOC41MTUxNSA5LjEzNTU1IDguOTIwMDYgOC45MzQ5MyA5LjI2NzU4QzguNzM0MzEgOS42MTUxMiA4LjQyMjYgOS44ODUwNyA4LjA0OTk1IDEwLjAzNEM4LjAwOTIzIDEwLjMxNjIgOC4wMDkyMyAxMC42MDI4IDguMDQ5OTUgMTAuODg1QzguNDIzMDIgMTEuMDMzNSA4LjczNTEzIDExLjMwMzQgOC45MzU4NCAxMS42NTEyQzkuMTM2NTQgMTEuOTk4OSA5LjIxNDEyIDEyLjQwNDIgOS4xNTYwMyAxMi44MDE1QzkuMjY4NDYgMTIuODg5NCA5LjM4NjY2IDEyLjk2OTIgOS41MTA2MiAxMy4wNDExTDEwLjQzNDMgMTAuMjcxMkMxMC40NzM5IDEwLjE1MjYgMTAuNTQ5OCAxMC4wNDk1IDEwLjY1MTMgOS45NzYzOEMxMC43NTI3IDkuOTAzMzEgMTAuODc0NiA5Ljg2Mzk5IDEwLjk5OTYgOS44NjM5OUMxMS4xMjQ2IDkuODYzOTkgMTEuMjQ2NSA5LjkwMzMxIDExLjM0NzkgOS45NzYzOEMxMS40NDk0IDEwLjA0OTUgMTEuNTI1MiAxMC4xNTI2IDExLjU2NDggMTAuMjcxMkwxMi40ODg2IDEzLjA0MTFDMTIuNjEyMiAxMi45Njk2IDEyLjczMDUgMTIuODg5NCAxMi44NDI2IDEyLjgwMUMxMi43ODUgMTIuNDAzOSAxMi44NjI2IDExLjk5OSAxMy4wNjMxIDExLjY1MTRDMTMuMjY0IDExLjMwMzYgMTMuNTc2MSAxMS4wMzM3IDEzLjk0OTIgMTAuODg1QzEzLjk5IDEwLjYwMjggMTMuOTkgMTAuMzE2MiAxMy45NDkyIDEwLjAzNEMxMy41NzYxIDkuODg1MjkgMTMuMjY0IDkuNjE1MzMgMTMuMDYzMSA5LjI2NzU4QzEyLjg2MjQgOC45MjAwNiAxMi43ODQ2IDguNTE1MTUgMTIuODQyIDguMTE4QzEyLjYxODEgNy45NDE0NSAxMi4zNyA3Ljc5Nzk2IDEyLjEwNTQgNy42OTE4OVpNNi44NzExNyA4LjA3NTY5QzYuODMxNDIgOC4xNDM0OSA2LjgwNTQ3IDguMjE4NDggNi43OTQ4MyA4LjI5NjM1QzYuNzg0MTggOC4zNzQyMiA2Ljc4OTA0IDguNDUzNDIgNi44MDkxMyA4LjUyOTQxQzYuODI5MjIgOC42MDUzOSA2Ljg2NDE0IDguNjc2NjUgNi45MTE4OCA4LjczOTA4QzYuOTU5NjIgOC44MDE1MSA3LjAxOTI0IDguODUzODkgNy4wODczIDguODkzMThDNy4xNTUzNiA4LjkzMjQ4IDcuMjMwNTMgOC45NTc5MyA3LjMwODQ3IDguOTY4MDZDNy4zODY0IDguOTc4MTkgNy40NjU1OCA4Ljk3MjggNy41NDE0MiA4Ljk1MjIxQzcuNjE3MjcgOC45MzE2MiA3LjY4ODMgOC44OTYyMyA3Ljc1MDQxIDguODQ4MDdDNy44MTI1MyA4Ljc5OTkyIDcuODY0NSA4LjczOTk2IDcuOTAzMzUgOC42NzE2M0M3Ljk4MTEzIDguNTM0ODMgOC4wMDE2NCA4LjM3MjgxIDcuOTYwNDEgOC4yMjA5NEM3LjkxOTE4IDguMDY5MDcgNy44MTk1NSA3LjkzOTY3IDcuNjgzMjYgNy44NjA5OEM3LjU0Njk4IDcuNzgyMjkgNy4zODUxIDcuNzYwNzEgNy4yMzI5NiA3LjgwMDkzQzcuMDgwODEgNy44NDExNSA2Ljk1MDc2IDcuOTM5OTIgNi44NzExNyA4LjA3NTY5Wk0xNC4zMTQ2IDcuODU3NTdDMTQuMjQ2MiA3Ljg5NjQxIDE0LjE4NjMgNy45NDgzOSAxNC4xMzgxIDguMDEwNUMxNC4wOSA4LjA3MjYyIDE0LjA1NDYgOC4xNDM2NCAxNC4wMzQgOC4yMTk0OUMxNC4wMTM0IDguMjk1MzQgMTQuMDA4IDguMzc0NTEgMTQuMDE4MSA4LjQ1MjQ1QzE0LjAyODMgOC41MzAzOSAxNC4wNTM3IDguNjA1NTUgMTQuMDkzIDguNjczNjJDMTQuMTMyMyA4Ljc0MTY4IDE0LjE4NDcgOC44MDEzIDE0LjI0NzEgOC44NDkwNEMxNC4zMDk1IDguODk2NzggMTQuMzgwOCA4LjkzMTcgMTQuNDU2OCA4Ljk1MTc5QzE0LjUzMjggOC45NzE4OCAxNC42MTIgOC45NzY3NCAxNC42ODk4IDguOTY2MDlDMTQuNzY3NyA4Ljk1NTQ0IDE0Ljg0MjcgOC45Mjk1IDE0LjkxMDUgOC44ODk3NUMxNS4wNDYzIDguODEwMTYgMTUuMTQ1IDguNjgwMSAxNS4xODUzIDguNTI3OTZDMTUuMjI1NSA4LjM3NTgyIDE1LjIwMzkgOC4yMTM5NCAxNS4xMjUyIDguMDc3NjVDMTUuMDQ2NSA3Ljk0MTM3IDE0LjkxNzEgNy44NDE3NCAxNC43NjUyIDcuODAwNTFDMTQuNjEzNCA3Ljc1OTI3IDE0LjQ1MTQgNy43Nzk3OSAxNC4zMTQ2IDcuODU3NTdaTTEwLjk5OTMgNS42OTE5QzEwLjg0MTIgNS42OTE5IDEwLjY4OTcgNS43NTQ2OCAxMC41Nzc5IDUuODY2NDRDMTAuNDY2MSA1Ljk3ODIxIDEwLjQwMzMgNi4xMjk3OSAxMC40MDMzIDYuMjg3ODRDMTAuNDAzMyA2LjQ0NTkgMTAuNDY2MSA2LjU5NzQ4IDEwLjU3NzkgNi43MDkyNEMxMC42ODk3IDYuODIxIDEwLjg0MTIgNi44ODM3OSAxMC45OTkzIDYuODgzNzlDMTEuMTU3NCA2Ljg4Mzc5IDExLjMwODkgNi44MjEgMTEuNDIwNyA2LjcwOTI0QzExLjUzMjUgNi41OTc0OCAxMS41OTUyIDYuNDQ1OSAxMS41OTUyIDYuMjg3ODRDMTEuNTk1MiA2LjEyOTc5IDExLjUzMjUgNS45NzgyMSAxMS40MjA3IDUuODY2NDRDMTEuMzA4OSA1Ljc1NDY4IDExLjE1NzQgNS42OTE5IDEwLjk5OTMgNS42OTE5WiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K'
  const star = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjZWI2ODY4Ii8+DQo8cGF0aCBkPSJNMTEgMTUuMDYyTDE0LjgwNiAxNy4zNjRDMTUuNTAzIDE3Ljc4NTggMTYuMzU1OSAxNy4xNjIyIDE2LjE3MjQgMTYuMzczNUwxNS4xNjM2IDEyLjA0NDhMMTguNTI5NCA5LjEyODM4QzE5LjE0MzkgOC41OTY0NiAxOC44MTM3IDcuNTg3NjQgMTguMDA2NyA3LjUyMzQ0TDEzLjU3NyA3LjE0NzQzTDExLjg0MzcgMy4wNTcxNEMxMS41MzE5IDIuMzE0MjkgMTAuNDY4IDIuMzE0MjkgMTAuMTU2MiAzLjA1NzE0TDguNDIyOTEgNy4xMzgyNkwzLjk5MzI5IDcuNTE0MjdDMy4xODYyNCA3LjU3ODQ3IDIuODU2MDggOC41ODcyOSAzLjQ3MDU0IDkuMTE5MjFMNi44MzYzMiAxMi4wMzU2TDUuODI3NSAxNi4zNjQzQzUuNjQ0MDggMTcuMTUzIDYuNDk2OTkgMTcuNzc2NyA3LjE5Mzk5IDE3LjM1NDhMMTEgMTUuMDYyWiIgZmlsbD0id2hpdGUiLz4NCjwvc3ZnPg0K'
  const tour = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcng9IjExIiBmaWxsPSIjNzlBNzEwIi8+DQo8cGF0aCBkPSJNNi43ODk0NSA4LjEwNTI2QzcuMzcwOCA4LjEwNTI2IDcuODQyMDggNy42MzM5OCA3Ljg0MjA4IDcuMDUyNjNDNy44NDIwOCA2LjQ3MTI4IDcuMzcwOCA2IDYuNzg5NDUgNkM2LjIwODEgNiA1LjczNjgyIDYuNDcxMjggNS43MzY4MiA3LjA1MjYzQzUuNzM2ODIgNy42MzM5OCA2LjIwODEgOC4xMDUyNiA2Ljc4OTQ1IDguMTA1MjZaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuMDUyNjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTEzLjEwNTMgMTIuMzE1OEMxMy4xMDUzIDEyLjMxNTggMTMuNjMxNiAxMC43MzY4IDEzLjYzMTYgOC4xMDUyNlY3LjA1MjYzQzEzLjYzMTYgNy4wNTI2MyAxMy4xMDUzIDYgMTIuMDUyNiA2QzExLjUyNjMgNiAxMSA2LjI2MzE2IDExIDYuMjYzMTYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS4wNTI2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTEuNTI2NCA5LjE1OEMxMS41MjY0IDguNTk5NjUgMTEuNzQ4MiA4LjA2NDE3IDEyLjE0MyA3LjY2OTM1QzEyLjUzNzggNy4yNzQ1NCAxMy4wNzMzIDcuMDUyNzMgMTMuNjMxNiA3LjA1MjczQzE0LjE5IDcuMDUyNzMgMTQuNzI1NSA3LjI3NDU0IDE1LjEyMDMgNy42NjkzNUMxNS41MTUxIDguMDY0MTcgMTUuNzM2OSA4LjU5OTY1IDE1LjczNjkgOS4xNTgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS4wNTI2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTMuNjMxNiA3LjA1MjYzQzEzLjYzMTYgNy4wNTI2MyAxNC4xNTc5IDYgMTUuMjEwNiA2QzE1LjczNjkgNiAxNi4yNjMyIDYuMjYzMTYgMTYuMjYzMiA2LjI2MzE2TTguODk0NzYgMTEuNzg5NUw5Ljk0NzM5IDE2TTYuMjYzMTggMTZMNi42MzE2IDE0Ljg5NDdDNi43MzY4NyAxNC42MzE2IDcuMDAwMDMgMTQuNDIxMSA3LjMxNTgyIDE0LjQyMTFIMTMuNjMxNkMxMy44OTQ4IDE0LjQyMTEgMTQuMzE1OCAxNC4yMTA1IDE0LjQ3MzcgMTRMMTYuMjYzMiAxMS43ODk1TTE1LjczNjkgMTZMMTQuMTU3OSAxNC40MjExTTYuNzg5NSAxMi4zMTU4TDguMzY4NDUgOS42ODQyMUwxMSAxMS4yNjMyTDYuNzg5NSAxMi4zMTU4WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjA1MjYzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjwvc3ZnPg0K'

  switch(type) {
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
  }
`

/**
 * 클러스터 키 가져오기
 */
const getClusterKey = `
  let gridSize = 50

  const zoomLevel = map.getLevel()
  
  if (zoomLevel < 5) {
    gridSize = 100
  } else if (zoomLevel >= 5 && zoomLevel < 10) {
    gridSize = 50
  } else {
    gridSize = 50
  }

  const projection = map.getProjection()
  const point = projection.pointFromCoords(position)
  const x = Math.floor(point.x / gridSize)
  const y = Math.floor(point.y / gridSize)

  return x + ',' + y
`

/**
 * 오버레이 높이 조절
 */
const getAnchorY = `
  return 0
`

/**
 * 장소 오버레이 생성 함수
 */
const settingPlaceOverlays = `
  let data = []
  const clusters = {}
  const level = map.getLevel()

  response.map((r, i) => {
    const d = {
      title: r.id.toString(),
      type: r.category,
      lat: r.lat,
      lng: r.lng
    }

    data.push(d)
  })

  initOverlays()

  data.forEach((d) => {
    type.forEach((t) => {
      if(d.type === t.toString()) {
        const key = getClusterKey(new kakao.maps.LatLng(d.lat, d.lng))

        if (!clusters[key]) {
          clusters[key] = []
        }

        clusters[key].push(d)
      }
    });
  });

  for (const key in clusters) {
    const items = clusters[key]

    if (items.length === 1) {
      const d = items[0]
      const imageUrl = getOverlayImage(d.type)
      const content = '<div class="customoverlay" data-key="' + d.title + '" style="position:relative;bottom:40px;background:#00339D;border-radius:20px 20px 20px 0;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">' +
        '  <div style="position:relative;display:flex;align-items:center;pointer-events: none;">' +
        '    <img src="' + imageUrl + '" style="width:30px;height:30px;">' +
        '  </div>' +
        '  <div style="position:absolute;bottom:-10px;left:0;width:0;height:0;border-top:10px solid #00339D;border-right:10px solid transparent;"></div>' +
        '</div>'

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(d.lat, d.lng),
        content: content,
        yAnchor: getAnchorY(level),
        xAnchor: 0  
      })

      showingOverlays.push(overlay);
    } else {
      let sumLat = 0
      let sumLng = 0
      let keys = ''
      const uniqueTypes = new Set()
    
      for (const item of items) {
        keys += item.title + ','
        sumLat += item.lat
        sumLng += item.lng
        uniqueTypes.add(item.type)
      }
      keys = keys.substring(0, keys.length - 1)
      
      const position = new kakao.maps.LatLng(sumLat / items.length, sumLng / items.length)
      
      let imagesHtml = ''
      const typeArray = Array.from(uniqueTypes)

      if(uniqueTypes.size === 1) {
        const imageUrl = getOverlayImage(typeArray[0])
        imagesHtml += '<img src="' + imageUrl + '" style="width:30px;height:30px;position:absolute;left:0;z-index:1;">'
      } else {
        typeArray.forEach((type, index) => {
          const imageUrl = getOverlayImage(type)
          imagesHtml += '<img src="' + imageUrl + '" style="width:30px;height:30px;position:absolute;left:' + (index * 15) + 'px;z-index:' + (typeArray.length - index) + ';">'
        })
      }

      let countHtml = ''
      countHtml = '<div style="background-color: white;border-radius: 50px;padding:8px;color:black;font-size:12px;text-align:center;margin-left:' + ((typeArray.length - 1) * 15 + 35) + 'px;">+' + items.length + '</div>'

      const content = '<div class="customoverlay" data-key="' + keys + '" style="position:relative;bottom:40px;background:#00339D;border-radius:20px 20px 20px 0;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">' +
        '  <div style="position:relative;display:flex;align-items:center;pointer-events: none;">' +
        imagesHtml + countHtml +
        '  </div>' +
        '  <div style="position:absolute;bottom:-10px;left:0;width:0;height:0;border-top:10px solid #00339D;border-right:10px solid transparent;"></div>' +
        '</div>'

      const overlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: getAnchorY(level),
        xAnchor: 0
      })

      showingOverlays.push(overlay)
    }
  }

  showOverlays()
`

/**
 * 이미지 정보 불러오기
 */
const fetchImages = () => {
  return `
    [
      {
          id: 1,
          url: 'https://img.freepik.com/premium-photo/beautiful-landscape_849761-6949.jpg', 
          lat: 33.450705,
          lng: 126.570677
      },
      {
          id: 2,
          url: 'https://cdn.dgtimes.co.kr/news/photo/202308/507969_26787_1530.jpg', 
          lat: 33.450936,
          lng: 126.569477
      },
      {
          id: 3,
          url: 'https://image.dongascience.com/Photo/2017/03/14885035562557.jpg', 
          lat: 33.450879,
          lng: 126.569940
      },
      {
          id: 4,
          url: 'https://blog.kakaocdn.net/dn/d1e6IL/btr41J8GWEF/YyPzwHfiDY5jOyAZWr6G7K/img.jpg',
          lat: 33.451393,
          lng: 126.570738
      }
    ]
  `
}

/**
 * 이미지 오버레이 생성 함수
 */
const settingImageOverlays = `
  initOverlays()

  const data = ${fetchImages()}
  const level = map.getLevel()
  const clusters = {}

  data.forEach((d) => {
    const key = getClusterKey(new kakao.maps.LatLng(d.lat, d.lng))

    if (!clusters[key]) {
      clusters[key] = []
    }

    clusters[key].push(d)
  });

  for (const key in clusters) {
    const items = clusters[key]

    if (items.length === 1) {
      const d = items[0]
      const content = '<div class="customoverlay" data-key="' + d.id + '" style="position:relative;bottom:40px;background:#00339D;border-radius:20px 20px 20px 0;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">' +
        '  <div style="position:relative;display:flex;align-items:center;pointer-events: none;">' +
        '    <img src="' + d.url + '" style="width:30px;height:30px;">' +
        '  </div>' +
        '</div>'

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(d.lat, d.lng),
        content: content,
        yAnchor: getAnchorY(level),
        xAnchor: 0
      })

      showingOverlays.push(overlay)
    } else {
      let keys = ''
      let sumLat = 0
      let sumLng = 0
      let imagesHtml = ''
    
      for (let i = 0; i < items.length && i < 5; i++) {
        sumLat += items[i].lat
        sumLng += items[i].lng
        imagesHtml += '<img src="' + items[i].url + '" style="width:30px;height:30px;position:absolute;left:' + (i * 15) + 'px;z-index:' + (items.length - i) + ';">'
      }

      items.map(item => keys += item.id + ',')
      keys = keys.substring(0, keys.length - 1)

      const position = new kakao.maps.LatLng(sumLat / items.length, sumLng / items.length)
      const countHtml = '<div style="background-color: white;border-radius: 50px;padding:8px;color:black;font-size:12px;text-align:center;margin-left:' + ((items.length - 1) * 15 + 35) + 'px;">+' + items.length + '</div>'

      const content = '<div class="customoverlay" data-key="' + keys + '" style="position:relative;bottom:40px;background:#00339D;border-radius:20px 20px 20px 0;padding:10px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">' +
        '  <div style="position:relative;display:flex;align-items:center;pointer-events: none;">' +
        imagesHtml + countHtml +
        '  </div>' +
        '  <div style="position:absolute;bottom:-10px;left:0;width:0;height:0;border-top:10px solid #00339D;border-right:10px solid transparent;"></div>' +
        '</div>'

      const overlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: getAnchorY(level),
        xAnchor: 0
      })

      showingOverlays.push(overlay)
    }
  }

  showOverlays()
`

/**
 * 지도에 등록할 함수를 적어주세요.
 * key: 함수명
 * val: String 타입의 함수 로직
 * isInit: 시작 함수 등록 여부
 */
const RegistFn = [
  {
    key: 'createMap({ lng, lat })',
    val: createMap,
  },
  {
    key: 'moveMap({ lng, lat })',
    val: moveMap,
  },
  {
    key: 'showTrfficInfo(isShow)',
    val: showTrfficInfo,
  },
  {
    key: 'initMarkers()',
    val: initMarkers,
  },
  {
    key: 'showMarkers()',
    val: showMarkers,
  },
  {
    key: 'initOverlays()',
    val: initOverlays,
  },
  {
    key: 'showOverlays()',
    val: showOverlays,
  },
  {
    key: 'getClusterKey(position)',
    val: getClusterKey,
  },
  {
    key: 'getAnchorY(level)',
    val: getAnchorY,
  },
  {
    key: 'getOverlayImage(type)',
    val: getOverlayImage,
  },
  {
    key: 'settingPlaceOverlays(type, response)',
    val: settingPlaceOverlays,
  },
  {
    key: 'settingImageOverlays()',
    val: settingImageOverlays,
  },
]

function js() {
  let registFn = ''

  RegistFn.forEach(fn => {
    registFn += `function ${fn.key} { ${fn.val} }`
  })

  return registFn
}

const map = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        process.env.KakaoJsApiKey
      }&libraries=services,clusterer,drawing"></script> 
  </head>
  <body style="margin: 0; padding: 0;">
      <div id="map" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>
      <script>
        let map
        let showingOverlays = []
        let markers = []
        let eyeState = true

        ${js()}
      </script>
  </body>
  </html>
`

export default map
