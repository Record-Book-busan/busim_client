import { View } from "react-native";
import { styled } from "nativewind";

import AppBarMenu from "./AppBarMenu";
import AppBarSearch from "./AppBarSearch";

const StyledView = styled(View);

function AppBar() {
  return (
    <StyledView className="absolute w-full bg-white opacity-80">
      <StyledView className="flex-row">
        <AppBarMenu />
        <AppBarSearch />
      </StyledView>
    </StyledView>
  );
}

export default AppBar;
