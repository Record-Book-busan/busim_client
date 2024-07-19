import { WebView } from "react-native-webview";
import { styled } from "nativewind";

import map from "@/services/map/map";

const StyledWebView = styled(WebView);

function MapView() {
  return <StyledWebView source={{ html: map }} />;
}

export default MapView;
