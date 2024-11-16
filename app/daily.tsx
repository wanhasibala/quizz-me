// App.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = (title: string) => {
    if (!title) return; // Only check if the title is provided
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // Format as hh:mm AM/PM

    const newTodo: Todo = {
      id: Date.now(),
      title,
      date,
      time,
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setTitle("");
    saveTodos(updatedTodos);
    Toast.show({
      type: "updateToast",
      text1: "Successfull created a new Task",
    });
  };

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  });
  const saveTodos = async (todos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
      console.error(e);
      console.log("todos");
    }
  };

  const loadTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos) setTodos(JSON.parse(todos));
    } catch (e) {
      console.error(e);
    }
  };
  const today = new Date().toISOString().split("T")[0];
  const todayTodos = todos.filter((todo) => todo.date === today);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        className="bg-blue-600 px-6 py-2 rounded-full z-2"
        onPress={() => setVisible(true)}
      >
        <Text className="text-xl text-white">+ Add Task</Text>
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
    zIndex: 2,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
