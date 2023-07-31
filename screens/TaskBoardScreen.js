import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const TaskBoardScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

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
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          ...doc.data(),
        });
      });

      console.log(users);
      setUsers(users);
    });

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

const Avatar = ({initial, backgroundColor}) => (
  <View style={{...styles.avatar, backgroundColor}}>
    <Text style={styles.avatarText}>{initial}</Text>
  </View>
);

const Task = ({ task, users }) => {
  return (
    <View style={styles.task}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <View style={styles.avatarsContainer}>
        {task.collaborators.map((collaboratorId, index) => {
          const user = users.find(user => user.userID === collaboratorId);
          const initial = user ? user.name[0].toUpperCase() : '';
          const color = user ? user.color : '#000';

          return (
            <Avatar 
              key={`${collaboratorId}-${index}`} 
              initial={initial}
              backgroundColor={color} 
            />
          );
        })}
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
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  avatar: {
    marginLeft: -10,
    backgroundColor: '#6a7f7a',
    borderRadius: 12.5,
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
