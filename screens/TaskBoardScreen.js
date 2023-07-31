import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const TaskBoardScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch tasks from Firebase
  useEffect(() => {
    const unsubscribeTasks = onSnapshot(collection(db, 'tasks'), async (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(tasks);
      setTasks(tasks);
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(users);
      setUsers(users);
    });

    // Cleanup function
    return () => {
      unsubscribeTasks();
      unsubscribeUsers();
    };
  }, []);

  return (
    <ScrollView horizontal style={styles.container}>
      {['pending', 'in progress', 'completed'].map((status, index) => (
        <ScrollView key={status} style={[styles.column, { backgroundColor: columnColors[index] }]}>
          <Text style={styles.columnTitle}>{status}</Text>
          {tasks.filter((task) => task.status === status).map((task) => (
            <Task key={task.id} task={task} users={users} />
          ))}
        </ScrollView>
      ))}
    </ScrollView>
  );
};

const Task = ({ task, users }) => {
  const collaboratorInitials = task.collaborators.map((collaboratorId) => {
    const user = users.find(user => user.userID === collaboratorId);
    return user ? user.name[0].toUpperCase() : '';
  }).join(', ');

  return (
    <View style={styles.task}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{collaboratorInitials}</Text>
      </View>
    </View>
  );
};

const columnColors = ['#F2F1F9', '#C2DDE6', '#D9F3DB'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
  column: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    padding: 15
  },
  columnTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#52575D',
  },
  task: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    width: 200
  },
  taskTitle: {
    fontSize: 16,
    color: '#52575D'
  },
  avatar: {
    backgroundColor: '#6a7f7a',
    borderRadius: 25,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 10,
  },
});

export default TaskBoardScreen;
