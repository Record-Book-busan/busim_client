import { TouchableOpacity, View } from "react-native";
import { styled } from "nativewind";

import { ImageVariant } from "@/components/atoms";

import icoMenu from "@/theme/assets/images/menu.png";

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

function AppBarMenu() {
  return (
    <StyledView className="flex flex-1 justify-center items-center">
      <StyledTouchableOpacity onPress={() => console.log("show menu.")}>
        <ImageVariant source={icoMenu} />
      </StyledTouchableOpacity>
    </StyledView>
  );
}

export default AppBarMenu;
