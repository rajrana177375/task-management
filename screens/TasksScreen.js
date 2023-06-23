import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Task from '../components/Task';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, addDoc, Timestamp, updateDoc, doc, where, query } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Input, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';


const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

 useEffect(() => {
    if (currentUser) {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('creator', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userTasks = snapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
        setTasks(userTasks);
      });
      return unsubscribe;
    }
  }, [currentUser]);  
  
  const handleTaskCreation = async () => {
    try {
      const userID = auth.currentUser.uid;
      const taskRef = collection(db, 'tasks');
  
      const dueDateTimestamp = taskDueDate ? Timestamp.fromDate(taskDueDate) : null;
  
      const newTask = {
        id: '',
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDateTimestamp,
        creator: userID,
        collaborators: [userID],
        status: 'in progress',
      };
      
  
      const addedTaskRef = await addDoc(taskRef, newTask);
      const taskId = addedTaskRef.id;
  
      const updatedTask = {
        ...newTask,
        id: taskId, 
      };
  
      await updateDoc(doc(db, 'tasks', taskId), updatedTask);
  
      setTasks([...tasks, updatedTask]);
  
      setTaskTitle('');
      setTaskDescription('');
      setTaskDueDate(new Date());
      setModalVisible(false);
      alert('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };
  
  const handleTaskUpdate = async () => {
    try {
      console.log('rrrr');
      if (!editingTask) {
        console.error('No task selected for update');
        return;
      }
      console.log('jjjj', editingTask);

  
      const taskDocRef = doc(db, 'tasks', editingTask.id);
  
      console.log('777777');
      const dueDateTimestamp = taskDueDate ? new Timestamp(taskDueDate.getTime() / 1000, 0) : null;
      console.log('55555');

      const updatedTask = {
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDateTimestamp,
        collaborators: editingTask.collaborators || [],
        status: editingTask.status,
      };
      
      console.log('1111');
      await updateDoc(taskDocRef, updatedTask);
  
      setTaskTitle('');
      setTaskDescription('');
      setTaskDueDate(new Date());
      setEditingTask(null);
      setModalVisible(false);
      alert('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task. Please try again.');
    }
  };
  
  

  const openTaskModal = (task) => {
    console.log(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate ? task.dueDate.toDate() : new Date());
    setEditingTask(task);
    setModalVisible(true);
  };  

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskDueDate;
    setShowDatePicker(false);
    setTaskDueDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {tasks.map((task, index) => (
          <Task key={index} task={task} onEditTask={openTaskModal} />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Input
              placeholder="Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <Input
              placeholder="Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
            <TouchableOpacity
              style={styles.datePickerContainer}
              onPress={() => setShowDatePicker(true)}
            >
              {showDatePicker ? (
                <DateTimePicker
                  value={taskDueDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              ) : (
                <Text>{taskDueDate.toLocaleDateString()}</Text>
              )}
            </TouchableOpacity>
            <Button
              title={editingTask ? 'Update Task' : 'Create Task'}
              onPress={editingTask ? handleTaskUpdate : handleTaskCreation}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                setEditingTask(null);
              }}
              buttonStyle={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  datePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: 'red',
  },
});

export default TasksScreen;
