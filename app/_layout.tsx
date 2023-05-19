import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SplashScreen, Stack } from "expo-router";
import { ImageBackground } from "react-native";
import { styled } from "nativewind";
import * as SecureStore from "expo-secure-store";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import Stripes from "../src/assets/stripes.svg";
import blurBg from "../src/assets/bg-blur.png";

const StyledStripes = styled(Stripes);

export default function Layout() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      setIsUserAuthenticated(!!token);
    });
  }, []);

  if (!hasLoadedFonts) return <SplashScreen />;

  return (
    <ImageBackground
      className="relative flex-1 bg-gray-900"
      source={blurBg}
      imageStyle={{
        position: "absolute",
        left: "-100%",
      }}
    >
      <StatusBar style="light" translucent />
      <StyledStripes className="absolute left-2" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  );
}
