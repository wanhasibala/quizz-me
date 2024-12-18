import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import AddTaskModal from "./_component/Modal";
import ListContainer from "./_component/ListContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface Todo {
  id: number;
  title: string;
  date: string;
  time: string;
  completed: boolean;
}

interface MarkedDate {
  selected?: boolean;
  selectedColor?: string;
  dots?: { color: string }[];
  marked?: boolean;
}

export default function Monthly() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);

  const getMarkedDates = (): { [date: string]: MarkedDate } => {
    const marks: { [date: string]: MarkedDate } = {};

    todos.forEach((task) => {
      if (marks[task.date]) {
        // If there are already tasks on this date, increase the count
        marks[task.date].dots?.push({ color: "#5c7cfa" });
      } else {
        // Initialize the date with a single dot
        marks[task.date] = {
          dots: [{ color: "#5c7cfa" }],
          marked: true,
        };
      }
    });

    Object.keys(marks).forEach((date) => {
      if (marks[date].dots && marks[date].dots.length > 1) {
        // More than one task: Show a red circle with the task count
        marks[date].dots = [
          { color: "#5c7cfa" }, // Default dot color
        ];
        marks[date].customStyles = {
          container: {
            position: "relative",
          },
          text: {
            color: "black",
          },
        };
      }
    });

    // Highlight selected date
    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: "#5c7cfa",
      };
    }

    return marks;
  };

  const addTodo = (title: string, time: string | null) => {
    if (!title) return; // Only check if the title is provided
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    console.log(time);

    const newTodo: Todo = {
      id: Date.now(),
      title,
      date: selectedDate ? selectedDate : date,
      time: time ? time : Date.now().toLocaleString(),
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setTitle("");
    saveTodos(updatedTodos);
    Toast.show({
      type: "updateToast",
      text1: "Succesful created new Task",
    });
  };

  const saveTodos = async (todos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOutsidePress = () => {
    setSelectedDate(null);
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    const dailyTasks = todos.filter((task) => task.date === day.dateString);
    setFilteredTasks(dailyTasks);
  };

  const filteredTodos = selectedDate
    ? todos.filter((todo) => todo.date === selectedDate)
    : todos;

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View className=" flex-1 bg-white mx-[20px] relative bg">
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType="multi-dot"
          theme={{
            selectedDayBackgroundColor: "#5c7cfa",
            todayTextColor: "#5c7cfa",
            arrowColor: "#5c7cfa",
          }}
          renderDay={(date: any, item: any) => {
            const hasMultipleTasks = item?.dots && item.dots.length > 1;
            return (
              <View style={{ position: "relative" }}>
                <Text>{date.day}</Text>
                {hasMultipleTasks && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "red",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 10 }}>
                      {item.dots.length}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
        />

        <View className="mt-10 ">
          <Text className="text-xl mb-5 font-medium ">
            {selectedDate
              ? `Tasks on ${selectedDate}`
              : "All Tasks for This Month"}
          </Text>
          <ListContainer
            todos={filteredTodos}
            setTodos={setTodos}
            setSelectedDate={setSelectedDate}
          />
          <AddTaskModal
            onAddTask={addTodo}
            visible={visible}
            onClose={() => setVisible(false)}
          />
        </View>
        <View className="w-fit absolute bottom-11 right-0">
          <TouchableOpacity
            className="bg-blue-600 px-6 py-2 rounded-full"
            onPress={() => setVisible(true)}
          >
            <Text className="text-xl text-white">+ Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // same styles as before
});
