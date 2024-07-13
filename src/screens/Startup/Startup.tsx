import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";

import { useTheme } from "@/theme";
import { Brand } from "@/components/molecules";
import { SafeScreen } from "@/components/template";

import type { RootScreenProps } from "@/types/navigation";

function Startup({ navigation }: RootScreenProps<"Startup">) {
  // 테마, 번역 기능 초기화
  const { layout, gutters, fonts } = useTheme();
  const { t } = useTranslation(["startup"]);

  // 데이터 fetching 시뮬레이션
  const { isSuccess, isFetching, isError } = useQuery({
    queryKey: ["startup"],
    queryFn: () => {
      // 실제 API 호출이나 초기화 로직으로 대체 가능
      return Promise.resolve(true);
    },
  });
  // 데이터 fetching 성공 시 Example 화면으로 자동 이동
  useEffect(() => {
    if (isSuccess) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Example" }],
        })
      );
    }
  }, [isSuccess]);

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.col,
          layout.itemsCenter,
          layout.justifyCenter,
        ]}
      >
        <View />
        <View
          style={[
            layout.flex_1,
            layout.col,
            layout.itemsCenter,
            layout.justifyCenter,
          ]}
        />
        <Brand />
        {/* 데이터 로딩 중 인디케이터 표시 */}
        {isFetching && (
          <ActivityIndicator size="large" style={[gutters.marginVertical_24]} />
        )}
        {/* 에러 발생 시 에러 메시지 표시 */}
        {isError && (
          <Text style={[fonts.size_16, fonts.red500]}>
            {t("startup:error")}
          </Text>
        )}
      </View>
    </SafeScreen>
  );
}

export default Startup;
