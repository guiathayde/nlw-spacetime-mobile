import { useEffect } from "react";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { styled } from "nativewind";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import { api } from "../src/lib/api";

import blurBg from "../src/assets/bg-blur.png";
import Stripes from "../src/assets/stripes.svg";
import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";

const StyledStripes = styled(Stripes);

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/569ad0b690bd3584c69a",
};

export default function App() {
  const router = useRouter();
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  const [, response, signInWithGitHub] = useAuthRequest(
    {
      clientId: "569ad0b690bd3584c69a",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "spacetime",
      }),
    },
    discovery
  );

  async function handleGithubOAuthToken(code: string) {
    const response = await api.post("/register", {
      code,
    });

    const { token } = response.data;

    await SecureStore.setItemAsync("token", token);

    router.push("/memories");
  }

  useEffect(() => {
    // console.log(
    //   makeRedirectUri({
    //     scheme: "spacetime",
    //   })
    // );

    // console.log(response);

    if (response?.type === "success") {
      const { code } = response.params;

      handleGithubOAuthToken(code);
    }
  }, [response]);

  if (!hasLoadedFonts) return null;

  return (
    <ImageBackground
      className="relative flex-1 items-center bg-gray-900 px-8 py-12"
      source={blurBg}
      imageStyle={{
        position: "absolute",
        left: "-100%",
      }}
    >
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGitHub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 por guiathayde
      </Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  );
}
