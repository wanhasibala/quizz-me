import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

interface Todo {
  id: number;
  title: string;
  date: string;
  time: string;
  completed: boolean;
}

interface ListContainerProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setSelectedDate: (date: string | null) => void;
}

const ListContainer: React.FC<ListContainerProps> = ({
  todos,
  setTodos,
  setSelectedDate,
}) => {
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("todos");
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (e) {
      console.error("Failed to load todos from storage", e);
    }
  };

  const saveTodos = async (updatedTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (e) {
      console.error("Failed to save todos", e);
    }
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(updatedTodos);
    Toast.show({
      type: "deleteToast",
      text1: "Task has been deleted",
    });
  };

  const toggleComplete = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    saveTodos(updatedTodos);
    const todo = updatedTodos.find((todo) => todo.id === id);
    Toast.show({
      type: "updateToast",
      text1: todo?.completed ? "Task Completed" : "Task Uncompleted",
      // text2: `The task "${todo?.title}" has been ${
      //   todo?.completed ? "marked as completed." : "marked as uncompleted."
      // }`,
    });
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation,
    itemId: number,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity onPress={() => deleteTodo(itemId)}>
        <Animated.View
          style={[styles.deleteButton, { transform: [{ scale }] }]}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item.id)
          }
        >
          <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <View>
                <Text
                  style={[styles.title, item.completed && styles.completed]}
                >
                  {item.title}
                </Text>
                <Text style={styles.dateTime}>
                  {item.date} - {item.time}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Swipeable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  completed: {
    textDecorationLine: "line-through",
  },
  dateTime: {
    fontSize: 14,
    color: "gray",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ListContainer;
