import * as Notifications from "expo-notifications";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListContainer from "./_component/ListContainer";
import AddTaskModal from "./_component/Modal";
import Toast from "react-native-toast-message";

// Define the type for a single todo item
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  date: string;
  time: string;
  notificationId?: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    requestNotificationPermission();
    loadTodos();
  }, []);

  // Request notification permissions
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  };

  const addTodo = async (title: string, time: string | null) => {
    if (!title) return; // Only check if the title is provided
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const newTodo: Todo = {
      id: Date.now(),
      title,
      date,
      time: time ? time : now.toLocaleTimeString(),
      completed: false,
    };

    function convertTo24HourFormat(time: string): string {
      // Match the time string using regex to extract hours, minutes, and period (AM/PM)
      const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
      if (!match) {
        throw new Error("Invalid time format");
      }

      let [_, hours, minutes, period] = match;
      let hourNum = parseInt(hours, 10);
      const minuteNum = parseInt(minutes, 10);

      // Convert to 24-hour format
      if (period.toUpperCase() === "PM" && hourNum !== 12) {
        hourNum += 12;
      } else if (period.toUpperCase() === "AM" && hourNum === 12) {
        hourNum = 0;
      }

      // Format the result as HH:mm
      const formattedTime = `${hourNum.toString().padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`;
      return formattedTime;
    }

    // Example usage
    const cleanedTime: string = convertTo24HourFormat(time);
    console.log(cleanedTime); // Outputs: 17:26

    // Example usage

    const deadline = `${date}T${cleanedTime}:00`;

    const trigger = new Date(deadline);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Uncompleted Task",
        body: `${title} is not completed yet, Please do something`,
        data: { data: "goes here", test: { test1: "more data" } },
      },
      trigger,
    });
    newTodo.notificationId = notificationId;
    console.log(notificationId);

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);

    Toast.show({
      type: "updateToast",
      text1: "New task created successfully!",
    });
  };

  const scheduleDeadlineNotification = async (
    title: string,
    deadline: Date,
  ) => {
    const triggerInSeconds = (deadline.getTime() - Date.now()) / 1000;

    // Ensure the trigger time is in the future
    if (triggerInSeconds > 0) {
      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Task Reminder",
            body: `Your task "${title}" is due soon!`,
            sound: true,
          },
          trigger: triggerInSeconds,
        });
        console.log("Scheduled notification ID:", notificationId);
        return notificationId;
      } catch (error) {
        console.error("Error scheduling notification:", error);
      }
    } else {
      console.warn(
        "The specified time is in the past. Cannot schedule notification.",
      );
    }
  };

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const saveTodos = async (todos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
      console.error("Error saving todos:", e);
    }
  };

  const loadTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos) setTodos(JSON.parse(todos));
    } catch (e) {
      console.error("Error loading todos:", e);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todayTodos = todos.filter((todo) => todo.date === today);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>+ Add Task</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <ListContainer
          todos={todayTodos}
          setTodos={setTodos}
          setSelectedDate={() => null}
        />
        <AddTaskModal
          onAddTask={addTodo}
          visible={visible}
          onClose={() => setVisible(false)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: "relative",
  },
  button: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
