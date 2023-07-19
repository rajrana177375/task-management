import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Task from '../components/Task';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, addDoc, Timestamp, updateDoc, doc, where, query } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Input, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [taskPriority, setTaskPriority] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterPriority, setFilterPriority] = useState('');


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const tasksRef = collection(db, 'tasks');
      let q = '';
      if (filterStatus && filterPriority) {
        q = query(
          tasksRef,
          where('creator', '==', currentUser.uid),
          where('status', '==', filterStatus),
          where('priority', '==', filterPriority)
        );
      } else if (filterStatus) {
        q = query(
          tasksRef,
          where('creator', '==', currentUser.uid),
          where('status', '==', filterStatus)
        );
      } else if (filterPriority) {
        q = query(
          tasksRef,
          where('creator', '==', currentUser.uid),
          where('priority', '==', filterPriority)
        );
      } else {
        q = query(
          tasksRef,
          where('creator', '==', currentUser.uid),
          where('status', '!=', 'completed')
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userTasks = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setTasks(userTasks);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [currentUser, filterStatus, filterPriority]);

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
        priority: taskPriority,
      };

      const addedTaskRef = await addDoc(taskRef, newTask);
      const taskId = addedTaskRef.id;

      const updatedTask = {
        ...newTask,
        id: taskId,
        priority: taskPriority,
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

  const addNewTask = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate(new Date());
    setModalVisible(true);
  }

  const handleTaskUpdate = async () => {
    try {
      if (!editingTask) {
        console.error('No task selected for update');
        return;
      }

      const taskDocRef = doc(db, 'tasks', editingTask.id);

      const dueDateTimestamp = taskDueDate ? new Timestamp(taskDueDate.getTime() / 1000, 0) : null;

      const updatedTask = {
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDateTimestamp,
        collaborators: editingTask.collaborators || [],
        status: editingTask.status,
        priority: taskPriority,
      };

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
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate ? task.dueDate.toDate() : new Date());
    setEditingTask(task);
    setModalVisible(true);
    setTaskPriority(task.priority);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskDueDate;
    setShowDatePicker(false);
    setTaskDueDate(currentDate);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter tasks by: </Text>


        <View style={styles.filterContainer}>
          <Button
            title="Filter tasks"
            onPress={() => setFilterModalVisible(true)}
          />
        </View>

      </View>


      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filter tasks by status: </Text>
              <Picker
                style={styles.filterPicker}
                selectedValue={filterStatus}
                onValueChange={handleFilterChange}
              >
                <Picker.Item label="None" value="" />
                <Picker.Item label="In Progress" value="in progress" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Pending" value="pending" />
              </Picker>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filter tasks by priority: </Text>
              <Picker
                style={styles.filterPicker}
                selectedValue={filterPriority}
                onValueChange={(value) => setFilterPriority(value)}
              >
                <Picker.Item label="None" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
            <Button
              title="Apply Filters"
              onPress={() => setFilterModalVisible(false)}
            />
          </View>
        </View>
      </Modal>


      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          tasks.map((task, index) => (
            <Task key={index} task={task} onEditTask={openTaskModal} />
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addNewTask}>
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
            <Picker
              selectedValue={taskPriority}
              onValueChange={(itemValue, itemIndex) => setTaskPriority(itemValue)}
            >
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
            <Button
              disabled={!taskTitle || !taskDescription || !taskDueDate}
              title={editingTask ? 'Update Task' : 'Create Task'}
              onPress={editingTask ? handleTaskUpdate : handleTaskCreation}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                setEditingTask(null);
                setTaskPriority('');
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  filterLabel: {
    marginRight: 5,
    fontWeight: 'bold',
  },
  filterPicker: {
    width: '65%',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6CBEED',
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
  filterModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  filterSection: {
    marginBottom: 20,
  },

});

export default TasksScreen;
