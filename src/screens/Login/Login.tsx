import { useState, useCallback } from "react";
import { login, isLogined } from "@react-native-kakao/user";

import {
  StyledText,
  StyledView,
  StyledTouchableOpacity,
  StyledImageVariant,
} from "@/theme/ThemeProvider/CustomNativeWind";
import { SafeScreen } from "@/components/template";
import { RootScreenProps } from "@/types/navigation";

import icoLogo from "@/theme/assets/images/logo_white.png";
import icoNotice from "@/theme/assets/images/ico-notice.png";
import icoKakao from "@/theme/assets/images/ico-kakao.png";
import icoApple from "@/theme/assets/images/ico-apple.png";
import icoGoogle from "@/theme/assets/images/ico-google.png";
import icoUser from "@/theme/assets/images/ico-user.png";

function Login({ navigation }: RootScreenProps<"Login">) {
  const [notice, setNotice] = useState("");

  /**
   * 카카오 로그인
   */
  const kakaoLogin = useCallback(async () => {
    if (!(await isLogined())) {
      await login();
    }

    if (await isLogined()) {
      navigation.navigate("BottomBar");
    } else {
      setNotice("카카오 로그인에 실패하였습니다.");
      setTimeout(() => {
        setNotice("");
      }, 1000);
    }
  }, [navigation]);

  const wrapKakaoLogin = useCallback(() => {
    void kakaoLogin();
  }, [kakaoLogin]);

  /**
   * 비회원 로그인
   */
  const unAuthorizedLogin = useCallback(() => {
    setNotice("비회원 로그인 시, 일부 기능들이 제한됩니다.");
    setTimeout(() => {
      navigation.navigate("BottomBar");
      setNotice("");
    }, 1000);
  }, [navigation]);

  return (
    <SafeScreen>
      <StyledView className="flex flex-1 bg-white items-center">
        {!!notice && (
          <StyledView className="absolute top-12 w-3/4 py-4 px-3 flex-row items-center bg-[#FFF0F0] border border-[#FF0000]">
            <StyledImageVariant source={icoNotice} />
            <StyledText className="ml-2 font-semibold">{notice}</StyledText>
          </StyledView>
        )}
        <StyledImageVariant
          className="mt-52 w-3/4 h-32 bg-red-200"
          source={icoLogo}
        />
        <StyledText>안녕하세요!</StyledText>
        <StyledText className="mb">끼록부에 오신 것을 환영합니다.</StyledText>
        <StyledText className="text-xl font-bold my-12">로그인하기</StyledText>
        <StyledView className="w-3/4 gap-2">
          <StyledTouchableOpacity
            className="bg-yellow-300"
            onPress={wrapKakaoLogin}
          >
            <StyledImageVariant
              className="absolute left-5 top-1/2 -translate-y-2"
              source={icoKakao}
            />
            <StyledText className="text-center py-4">
              카카오로 계속하기
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="bg-black">
            <StyledImageVariant
              className="absolute left-5 top-1/2 -translate-y-4"
              source={icoApple}
            />
            <StyledText className="text-center py-4 text-white">
              Apple로 계속하기
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="bg-white border border-gray-300">
            <StyledImageVariant
              className="absolute left-5 top-1/2 -translate-y-3"
              source={icoGoogle}
            />
            <StyledText className="text-center py-4">
              Google로 계속하기
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            className="bg-gray-300"
            onPress={unAuthorizedLogin}
          >
            <StyledImageVariant
              className="absolute left-5 top-1/2 -translate-y-3"
              source={icoUser}
            />
            <StyledText className="text-center py-4">
              비회원으로 계속하기
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </SafeScreen>
  );
}

export default Login;
