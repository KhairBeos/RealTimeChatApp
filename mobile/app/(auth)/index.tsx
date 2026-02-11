import useAuthSocial from "@/hooks/useSocialAuth";
import { Image } from "expo-image";
import { ActivityIndicator, Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  const isLoading = loadingStrategy !== null;
  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden"></View>

      <SafeAreaView className="flex-1">
        {/* Logo and Title Section */}
        <View className="items-center pt-10">
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 100, height: 100, marginVertical: -20 }}
            contentFit="contain"
          />
          <Text className="font-serif text-4xl font-bold uppercase tracking-wider text-primary">
            Chat Lor VCL
          </Text>
        </View>

        {/* Illustration Section */}
        <View className="flex-1 items-center justify-center px-6">
          <Image
            source={require("../../assets/images/auth.png")}
            style={{ width: width - 48, height: height * 0.3 }}
            contentFit="contain"
          />

          {/* Description Section */}
          <View className="mt-6 items-center">
            <Text className="text-center font-sans text-5xl font-bold text-foreground">
              Connect & Chat
            </Text>
            <Text className="font-mono text-3xl font-bold text-primary">Seamlessly</Text>
          </View>

          {/* Auth Buttons Section */}
          <View className="mt-10 flex-row gap-4">
            {/* Google Sign-In Button */}
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-white py-4 active:scale-[0.97]"
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Google"
              onPress={() => !isLoading && handleSocialAuth("oauth_google")}
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/google.png")}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                  <Text className="text-sm font-semibold text-gray-900">Google</Text>
                </>
              )}
            </Pressable>

            {/* Github Sign-In Button */}
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-white py-4 active:scale-[0.97]"
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Github"
              onPress={() => !isLoading && handleSocialAuth("oauth_github")}
            >
              {loadingStrategy === "oauth_github" ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/github.png")}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                  <Text className="text-sm font-semibold text-gray-900">GitHub</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
