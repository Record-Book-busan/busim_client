import { TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { styled } from "nativewind";

import { ImageVariant } from "@/components/atoms";

import icoSearch from "@/theme/assets/images/ico_search.png";

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

function AppBarSearch() {
  return (
    <StyledView className="flex flex-[5] justify-center items-center p-4">
      <StyledView className="w-full flex-row justify-center items-center bg-white opacity-100 rounded-full shadow shadow-black px-4">
        <StyledTextInput className="flex flex1 pl-4 w-full" />
        <StyledTouchableOpacity
          className="mr-2"
          onPress={() => console.log("search.")}
        >
          <ImageVariant source={icoSearch} />
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}

export default AppBarSearch;
