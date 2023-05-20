import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import * as SecureStore from "expo-secure-store";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";

import { api } from "../src/lib/api";

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";

interface Memory {
  id: string;
  coverUrl: string;
  excerpt: string;
  createdAt: string;
}

dayjs.locale(ptBr);

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const [memories, setMemories] = useState<Memory[]>([]);

  async function signOut() {
    await SecureStore.deleteItemAsync("token");

    router.push("/");
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync("token");

    const response = await api.get("/memories", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setMemories(response.data);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <View className="flex-1" style={{ paddingBottom: bottom, paddingTop: top }}>
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        <View className="mb-4 flex-row gap-2 px-8">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        data={memories}
        renderItem={({ item }) => (
          <View className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(item.createdAt).format("DD [de] MMMM, YYYY")}
              </Text>
            </View>
            <View className="px8 space-y-4">
              <Image
                source={{
                  uri: item.coverUrl,
                }}
                className="aspect-video w-full rounded-lg"
                alt="Memória"
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {item.excerpt}
              </Text>
              <Link href="/memories/id" asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={{
          paddingBottom: bottom + 40,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
      />

      {/* <ScrollView className="mt-6 space-y-10">
        <View className="space-y-4">
          <View className="flex-row items-center gap-2">
            <View className="h-px w-5 bg-gray-50" />
            <Text className="font-body text-xs text-gray-100">
              12 de Abril, 2023
            </Text>
          </View>
          <View className="px8 space-y-4">
            <Image
              source={{
                uri: "http://localhost:3333/uploads/d519f0a3-4798-4727-893b-049f8db24ea9.jpeg",
              }}
              className="aspect-video w-full rounded-lg"
              alt="Memória"
            />
            <Text className="font-body text-base leading-relaxed text-gray-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Link href="/memories/id" asChild>
              <TouchableOpacity className="flex-row items-center gap-2">
                <Text className="font-body text-sm text-gray-200">
                  Ler mais
                </Text>
                <Icon name="arrow-right" size={16} color="#9e9ea0" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView> */}
    </View>
  );
}
