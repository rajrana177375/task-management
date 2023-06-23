import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';

const Task = ({ task }) => {

  const dueDate = task.dueDate ? task.dueDate.toDate() : null;

  return (
    <Card>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{task.title}</Text>
      </View>
      <Card.Divider />
      <Text>Description: {task.description}</Text>
      {dueDate && isValidDate(dueDate) && (
        <Text>Due Date: {dueDate.toLocaleDateString()}</Text>
      )}
    </Card>
  );
};

const isValidDate = (date) => {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
};

const styles = {
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editIcon: {
    color: 'blue',
  },
};

export default Task;
