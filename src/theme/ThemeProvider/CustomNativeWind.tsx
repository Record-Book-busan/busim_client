import { Text, View, TouchableOpacity } from "react-native";
import { styled } from "nativewind";

import { ImageVariant } from "@/components/atoms";

const StyledText = styled(Text, "text-black text-sm");

const StyledView = styled(View, "rounded-xl w-full");

const StyledTouchableOpacity = styled(TouchableOpacity, "rounded-xl");

const StyledImageVariant = styled(ImageVariant);

export { StyledText, StyledView, StyledTouchableOpacity, StyledImageVariant };
