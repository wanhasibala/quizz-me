# Quizz Me
Quizz Me is a mobile app built with React Native that allows users to take quizzes on various topics. It is designed with a clean UI, including functional components, navigation between different quiz topics, and task tracking capabilities to keep users engaged. This app uses Expo Router for navigation and provides toast notifications to improve the user experience.

# Features
Quiz Topics: Browse through various quiz topics to test your knowledge.
Daily and Monthly Tasks: Track daily and monthly tasks with a custom Todo List.
Toast Notifications: Receive feedback with toast messages for actions like creating, completing, or deleting tasks.
Swipe to Delete: Easily delete tasks by swiping them away.
Local Storage: Tasks are saved using AsyncStorage to retain data across sessions.
Installation
Clone the repository:

  ```bash
        git clone https://github.com/yourusername/quizz-me.git
        cd quizz-me
   ```

# Install dependencies using Expo:
  ```bash
        expo install
   ```

# Start the Expo development server:

```bash
expo start
```
Use the QR code or emulator to open the app on your mobile device.

# Usage
Monthly Page: Create and manage todo list by date of the month
Daily Page: Create and manage todo list by today
Task Management: Use the Todo List to add, complete, or delete tasks.
Press the Add Task button to create a new task.
Swipe left on a task to delete it.
Tap on a task to toggle its completion status.
Toast Notifications: Toasts will appear for task actions such as task creation, completion, or deletion.

# Components
App.tsx: The root component that sets up the navigation and toast provider.
Daily.tsx: Shows daily tasks and filters tasks to those due today.
Monthly.tsx: Displays monthly tasks and allows users to select specific dates.
ListContainer.tsx: Renders the list of tasks and includes swipe-to-delete functionality.
AddTaskModal.tsx: A modal component to add new tasks with custom input fields.

# Dependencies
React Native
Expo
React Navigation
React Native Toast Message
React Native Gesture Handler
AsyncStorage

# Customization
Customize toast messages in ListContainer.tsx for different task actions.
Update colors, fonts, or styles in the various components under the styles object.

# License
This project is licensed under the MIT License.
