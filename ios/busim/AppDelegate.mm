#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNCKakaoUser/RNCKakaoUserUtil.h>

#import <KakaoOpenSDK/KakaoOpenSDK.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"busim";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [KOSession sharedSession].appKey = @"572d2540a7893d0c189b2b872193effb";

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  // 카카오톡에서 전달된 URL scheme면 이 앱에서 핸들링하는 로직입니다.
  if([RNCKakaoUserUtil isKakaoTalkLoginUrl:url]) {
    return [RNCKakaoUserUtil handleOpenUrl:url];
  }

  // 카카오 세션 처리
  if ([[KOSession sharedSession] handleOpenURL:url]) {
    return YES;
  }

  // React Native Linking 처리
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

@end
