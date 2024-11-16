import { BaseToastProps } from "react-native-toast-message";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const toastConfig = {
  updateToast: ({ text1 }: { text1: string }) => (
    <View className=" flex flex-row items-center gap-2 bg-gray-50 rounded-xl shadow-sm shadow-green-100 border border-green-100 w-[80%] h-fit mt-10 p-4">
      <Ionicons name="checkmark-circle" color="#355e3b" size={20} />
      <Text className="text-xl">{text1}</Text>
    </View>
  ),
  deleteToast: ({ text1 }: { text1: string }) => (
    <View className=" flex flex-row items-center gap-2 bg-red-50 rounded-xl shadow-sm  border border-green-100 w-[80%] h-fit mt-10 p-4">
      <Ionicons name="checkmark-circle" color="#d32f2f" size={20} />
      <Text className="text-xl">{text1}</Text>
    </View>
  ),
};
