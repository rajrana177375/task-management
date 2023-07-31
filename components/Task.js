import { db } from '../services/firebase';
import { Text, View, Alert, StyleSheet } from 'react-native';
import { Card, Button, ButtonGroup, Icon } from 'react-native-elements';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#F1F1F1',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#444',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#444',
    marginBottom: 10,
  },
  buttonGroupContainer: {
    marginVertical: 10,
  },
  buttonGroupButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F1F1F1',
    borderWidth: 1,
  },
  buttonGroupSelected: {
    backgroundColor: '#F1F1F1',
  },
  buttonText: {
    color: '#000000',
  },
  buttonSelectedText: {
    color: '#FFFFFF',
  },
  editButtonContainer: {
    marginTop: 10,
  },
  noteText: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },
});

const Task = ({ task, onEditTask, currentUser, allUsers }) => {
  const handleEditTask = () => {
    onEditTask(task);
  };

  const handleTaskStatusChange = async (status) => {
    try {
      const updatedTask = { ...task, status };
      await updateDoc(doc(db, 'tasks', task.id), updatedTask);
      alert('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error updating task status. Please try again.');
    }
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to permanently delete this task?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'DELETE',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'tasks', task.id));
              alert('Task deleted successfully!');
            } catch (error) {
              console.error('Error deleting task:', error);
              alert('Error deleting task. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'in progress':
        return '#4FC3F7';  // Light Blue
      case 'completed':
        return '#66BB6A';  // Light Green
      case 'pending':
        return '#EF5350';  // Red
      default:
        return '#E0E0E0';  // Grey
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF5350';  // Red
      case 'medium':
        return '#FFA726';  // Orange
      case 'low':
        return '#66BB6A';  // Light Green
      default:
        return '#78909C';  // Blue Grey
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work':
        return '#90CAF9';  // Blue
      case 'personal':
        return '#F48FB1';  // Pink
      case 'others':
        return '#BCAAA4';  // Brown
      default:
        return '#CFD8DC';  // Light Blue Grey
    }
  };

  return (
    <Card containerStyle={[styles.cardContainer, { borderColor: getPriorityColor(task.priority), backgroundColor: getCategoryColor(task.category) }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.priorityText}>Priority: {task.priority?.toUpperCase() || 'LOW'}</Text>
        {currentUser && currentUser.uid == task.creator ? 
          <Icon name="trash" type="font-awesome" color="#FF0000" onPress={handleDeleteTask} /> : 
          <Text> Assigned By: {allUsers.find(user => user.id == task.creator)?.name}</Text> 
        }
      </View>
      <Card.Divider />
      <Text style={styles.descriptionText}>Description: {task.description}</Text>
      <Text style={styles.categoryText}>Category: {task.category?.toUpperCase() || 'OTHERS'}</Text>
      <ButtonGroup 
        buttons={['In Progress', 'Completed', 'Pending']}
        selectedIndex={task.status === 'completed' ? 1 : task.status === 'pending' ? 2 : 0}
        onPress={(index) => {
          const status = index === 1 ? 'completed' : index === 2 ? 'pending' : 'in progress';
          handleTaskStatusChange(status);
        }}
        containerStyle={styles.buttonGroupContainer}
        buttonStyle={styles.buttonGroupButton}
        selectedButtonStyle={[styles.buttonGroupSelected, { backgroundColor: getStatusColor(task.status) }]}
        textStyle={styles.buttonText}
        selectedTextStyle={styles.buttonSelectedText}
      />
      <Button title="Edit" onPress={handleEditTask} containerStyle={styles.editButtonContainer} />
      <Text style={styles.noteText}>*note: {task.note}</Text>
    </Card>
  );
};

export default Task;
