import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Task from '../components/Task';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, addDoc, Timestamp, updateDoc, doc, where, query } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Input, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select'

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
  const [filterCategory, setFilterCategory] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [taskCategory, setTaskCategory] = useState('');
  const [taskNote, setTaskNote] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [taskStatus, setTaskStatus] = useState('');


  const multiSelect = useRef();

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {

      let usersArray = snapshot.docs.map((doc) => doc.data());
      setUsers(usersArray.map(e => ({ name: e.name, id: e.userID })));

    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const tasksRef = collection(db, 'tasks');
      let q = '';
      if (filterStatus && filterPriority && filterCategory) {
        q = query(
          tasksRef,
          where('status', '==', filterStatus),
          where('priority', '==', filterPriority),
          where('category', '==', filterCategory)
        );
      } else if (filterStatus && filterPriority) {
        q = query(
          tasksRef,
          where('status', '==', filterStatus),
          where('priority', '==', filterPriority)
        );
      } else if (filterStatus && filterCategory) {
        q = query(
          tasksRef,
          where('status', '==', filterStatus),
          where('category', '==', filterCategory)
        );
      } else if (filterPriority && filterCategory) {
        q = query(
          tasksRef,
          where('priority', '==', filterPriority),
          where('category', '==', filterCategory)
        );
      } else if (filterStatus) {
        q = query(
          tasksRef,
          where('status', '==', filterStatus)
        );
      } else if (filterPriority) {
        q = query(
          tasksRef,
          where('priority', '==', filterPriority)
        );
      } else if (filterCategory) {
        q = query(
          tasksRef,
          where('category', '==', filterCategory)
        );
      } else {
        q = query(
          tasksRef
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let userTasks = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        userTasks = userTasks.filter(el => el.collaborators.find(uid => uid == currentUser.uid) || el.creator == currentUser.uid)
        setTasks(userTasks);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [currentUser, filterStatus, filterPriority, filterCategory]);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const tasksRef = collection(db, 'tasks');
      let q = '';
      if (searchTerm) {
        q = query(tasksRef, where('title', '==', searchTerm));
      } else {
        q = query(tasksRef);
      }
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let userTasks = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        userTasks = userTasks.filter(el => el.collaborators.find(uid => uid == currentUser.uid) || el.creator == currentUser.uid)
        setTasks(userTasks);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [currentUser, searchTerm]);


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
        collaborators: selectedItems.length ? selectedItems : [auth.currentUser.uid],
        status: taskStatus,
        priority: taskPriority,
        category: taskCategory,
        note: taskNote,
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
      setTaskCategory('');
      setSelectedItems([]);
      setTaskNote('');
      setTaskStatus('');
      setTaskPriority('');
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
        collaborators: selectedItems.length ? selectedItems : [auth.currentUser.uid],
        status: taskStatus,
        priority: taskPriority,
        category: taskCategory,
        note: taskNote,
      };
      await updateDoc(taskDocRef, updatedTask);

      setTaskTitle('');
      setTaskDescription('');
      setTaskDueDate(new Date());
      setEditingTask(null);
      setModalVisible(false);
      setTaskCategory('');
      setSelectedItems([]);
      setTaskNote('');
      setTaskStatus('');
      setTaskPriority('');
      alert('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task. Please try again.');
    }
  };

  const clearData = () => {
    setModalVisible(false); 
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate(new Date());
    setEditingTask(null);
    setModalVisible(false);
    setTaskCategory('');
    setSelectedItems([]);
    setTaskNote('');
    setTaskStatus('');
    setTaskPriority('');
  }

  const openTaskModal = (task) => {
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate ? task.dueDate.toDate() : new Date());
    setEditingTask(task);
    setModalVisible(true);
    setTaskPriority(task.priority);
    setTaskCategory(task.category);
    setTaskStatus(task.status)
    setTaskNote(task.note);
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
        <TextInput
          style={styles.searchBox}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search tasks"
        />
        <View style={styles.filterContainer}>
          <Button title="Open Filter" onPress={() => setFilterModalVisible(true)} buttonStyle={styles.openFilterButton} titleStyle={styles.openFilterButtonText} />
        </View>
      </View>
      <Modal visible={filterModalVisible} animationType="slide" transparent={true} onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalContent}>
            <Text style={styles.filterHeader}>Apply Filters</Text>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filter tasks by status: </Text>
              <Picker style={styles.filterPicker} selectedValue={filterStatus} onValueChange={handleFilterChange}>
                <Picker.Item label="None" value="" />
                <Picker.Item label="In Progress" value="in progress" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Pending" value="pending" />
              </Picker>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filter tasks by priority: </Text>
              <Picker style={styles.filterPicker} selectedValue={filterPriority} onValueChange={(value) => setFilterPriority(value)}>
                <Picker.Item label="None" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filter tasks by category: </Text>
              <Picker style={styles.filterPicker} selectedValue={filterCategory} onValueChange={(itemValue) => setFilterCategory(itemValue)}>
                <Picker.Item label="None" value="" />
                <Picker.Item label="Work" value="work" />
                <Picker.Item label="Personal" value="personal" />
                <Picker.Item label="Others" value="others" />
              </Picker>
            </View>
            <Button title="Apply Filters" onPress={() => setFilterModalVisible(false)} buttonStyle={styles.applyFilterButton} titleStyle={styles.applyFilterButtonText} />
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.taskList}>
        {loading ? (
          <ActivityIndicator size="large" color="#E1B12C" />
        ) : (
          tasks.map((task, index) => (
            <Task key={index} task={task} onEditTask={openTaskModal} currentUser={currentUser} allUsers={users} />
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={addNewTask}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
      <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{editingTask ? 'Update Task' : 'Create Task'}</Text>
            <Input placeholder="Title" value={taskTitle} onChangeText={setTaskTitle} inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} />
            <Input placeholder="Description" value={taskDescription} onChangeText={setTaskDescription} inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} multiline={true} />
            <View style={styles.datePickerContainer}>
              {showDatePicker ? (
                <DateTimePicker value={taskDueDate} mode="date" display="default" onChange={handleDateChange} minimumDate={new Date()} />
              ) : (
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.datePickerText}>Select Due Date: {taskDueDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
              )}
            </View>
            <MultiSelect hideTags items={users} uniqueKey="id" ref={multiSelect} onSelectedItemsChange={onSelectedItemsChange} selectedItems={selectedItems} selectText="Pick Collaborators" searchInputPlaceholderText="Search Collaborators..." onChangeInput={(text) => console.log(text)} tagRemoveIconColor="#CCC" tagBorderColor="#CCC" tagTextColor="#CCC" selectedItemTextColor="#CCC" selectedItemIconColor="#CCC" itemTextColor="#000" displayKey="name" searchInputStyle={{ color: '#CCC' }} hideSubmitButton={true} />
            <View>
              {multiSelect.current && multiSelect.current.getSelectedItemsExt(selectedItems)}
            </View>
            {/* <View style={styles.pickerContainer}>
              <Picker
                selectedValue={taskStatus}
                onValueChange={(itemValue) => setTaskStatus(itemValue)}>
                <Picker.Item label="In Progress" value="in progress" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Pending" value="pending" />
              </Picker>
            </View> */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={taskPriority}
                onValueChange={(itemValue) => setTaskPriority(itemValue)}>
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={taskCategory}
                onValueChange={(itemValue) => setTaskCategory(itemValue)}>
                <Picker.Item label="Work" value="work" />
                <Picker.Item label="Personal" value="personal" />
                <Picker.Item label="Others" value="others" />
              </Picker>
            </View>
            <TextInput
              style={styles.inputNote}
              multiline={true}
              numberOfLines={4}
              onChangeText={text => setTaskNote(text)}
              value={taskNote}
              placeholder="Add Note"
            />
            <Button title={editingTask ? 'Update Task' : 'Create Task'} onPress={editingTask ? handleTaskUpdate : handleTaskCreation} buttonStyle={styles.createTaskButton} titleStyle={styles.createTaskButtonText} disabled={!taskTitle || !taskDescription || !taskDueDate} />
            <Button title="Cancel" onPress={() => { clearData() }} buttonStyle={styles.cancelButton} titleStyle={styles.cancelButtonText} />
          </View>
        </View>
        </TouchableWithoutFeedback>
  </KeyboardAvoidingView>     
   </Modal>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
  },
  openFilterButton: {
    backgroundColor: '#E1B12C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  openFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  filterHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterPicker: {
    height: 50,
    width: '100%',
  },
  applyFilterButton: {
    backgroundColor: '#E1B12C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskList: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#E1B12C',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    borderBottomColor: 'transparent',
  },
  inputText: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  datePickerText: {
    fontSize: 16,
  },
  createTaskButton: {
    backgroundColor: '#E1B12C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createTaskButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#333',
  },
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  pickerContainer: {
    marginVertical: 5,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
  },
  
  inputNote: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    textAlignVertical: 'top',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  }
  
});



export default TasksScreen;
