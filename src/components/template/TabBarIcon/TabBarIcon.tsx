import { Text, View } from "react-native";
import { styled } from "nativewind";

import { ImageVariant } from "@/components/atoms";

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImageVariant = styled(ImageVariant);

function TabBarIcon({
  focused,
  icon,
  activeIcon,
  label,
}: {
  focused: boolean;
  icon: any;
  activeIcon: any;
  label: string;
}) {
  return (
    <StyledView className="flex flex-1 justify-center items-center gap-2">
      <StyledImageVariant source={focused ? activeIcon : icon} />
      <StyledText className={focused ? "text-customBlu" : ""}>
        {label}
      </StyledText>
    </StyledView>
  );
}

export default TabBarIcon;
