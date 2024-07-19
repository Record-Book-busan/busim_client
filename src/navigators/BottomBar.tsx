import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { RootStackParamList } from "@/types/navigation";
import { Recommand, Camera, Mypage } from "@/screens";
import { AppBar, SafeScreen, TabBarIcon } from "@/components/template";

import icoRecommand from "@/theme/assets/images/ico_recommand_grey.png";
import icoRecommandActive from "@/theme/assets/images/ico_recommand_blue.png";
import icoCamera from "@/theme/assets/images/ico_camera_grey.png";
import icoCameraActive from "@/theme/assets/images/ico_camera_blue.png";
import icoMypage from "@/theme/assets/images/ico_mypage_grey.png";
import icoMypageActive from "@/theme/assets/images/ico_mypage_blue.png";

const Bar = createBottomTabNavigator<RootStackParamList>();

function RecommandIcon({ focused }: { focused: boolean }) {
  return (
    <TabBarIcon
      focused={focused}
      icon={icoRecommand}
      activeIcon={icoRecommandActive}
      label="추천"
    />
  );
}

function CameraIcon({ focused }: { focused: boolean }) {
  return (
    <TabBarIcon
      focused={focused}
      icon={icoCamera}
      activeIcon={icoCameraActive}
      label="카메라"
    />
  );
}

function MypageIcon({ focused }: { focused: boolean }) {
  return (
    <TabBarIcon
      focused={focused}
      icon={icoMypage}
      activeIcon={icoMypageActive}
      label="마이페이지"
    />
  );
}

function BottomBarNavigator() {
  return (
    <SafeScreen>
      <Bar.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "white",
            height: 80,
          },
        }}
      >
        <Bar.Screen
          name="Recommand"
          component={Recommand}
          options={{
            tabBarIcon: RecommandIcon,
          }}
        />
        <Bar.Screen
          name="Camera"
          component={Camera}
          options={{
            tabBarIcon: CameraIcon,
          }}
        />
        <Bar.Screen
          name="Mypage"
          component={Mypage}
          options={{
            tabBarIcon: MypageIcon,
          }}
        />
      </Bar.Navigator>
      <AppBar />
    </SafeScreen>
  );
}

export default BottomBarNavigator;
