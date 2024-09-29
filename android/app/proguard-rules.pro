# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# 1. 카카오 SDK 관련 클래스 유지
-keep class com.kakao.** { *; }
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn com.kakao.**

# 2. Gson 관련 클래스 유지 (JSON 직렬화/역직렬화 보호)
-keep class com.google.gson.** { *; }
-keep class * extends com.google.gson.TypeAdapter { *; }
-keep class * extends com.google.gson.TypeAdapterFactory { *; }
-keep class * extends com.google.gson.JsonSerializer { *; }
-keep class * extends com.google.gson.JsonDeserializer { *; }
-keep class * implements com.google.gson.JsonDeserializer { *; }
-keepattributes Signature
-keepattributes *Annotation*

# 3. OkHttp 관련 경고 무시
-dontwarn okhttp3.**
-dontwarn okio.**

# 4. Retrofit 관련 클래스 유지
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions

# 5. Retrofit의 인터페이스와 동적 프록시 클래스 보호
# Retrofit에서 프록시를 사용하므로 인터페이스를 보호해야 합니다.
-keep interface retrofit2.** { *; }
-keep class * implements retrofit2.Call { *; }
-keep class * implements retrofit2.Callback { *; }

# 6. BouncyCastle, Conscrypt 관련 경고 무시 (네트워크 라이브러리에서 사용될 수 있음)
-dontwarn org.bouncycastle.jsse.**
-dontwarn org.conscrypt.*
-dontwarn org.openjsse.**

# 7. 최적화 비활성화 (최적화로 인한 오류 방지)
# 필요에 따라 활성화 가능. 먼저 비활성화 후 문제를 확인한 뒤 최적화 사용을 고려
-dontoptimize

# 8. ProGuard에서 제거되지 말아야 할 기타 클래스 및 리소스 보호

# 클래스명, 필드명이 유지되어야 하는 경우
-keep class **.R$* { *; }

# 네이티브 라이브러리 경고 무시
-dontwarn java.nio.file.**
-dontwarn sun.misc.Unsafe

# 9. XML 리소스 유지 (특정 리소스가 제거되지 않도록 설정)
-keepresources xml/**
-keepresources drawable/**
-keepresources layout/**

# 10. 애노테이션 유지 (의존성있는 애노테이션을 보호)
-keepattributes *Annotation*

# 11. AndroidX 관련 클래스 보호
-keep class androidx.** { *; }
-dontwarn androidx.**

# 12. ProGuard가 외부 라이브러리의 에러를 경고하지 않도록 설정
# 외부 라이브러리에서 난독화로 인해 발생하는 경고를 무시
-dontwarn com.squareup.**
-dontwarn javax.annotation.**