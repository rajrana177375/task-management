import { db } from '../services/firebase';
import { Text, View, Alert } from 'react-native';
import { Card, Button, ButtonGroup, Icon } from 'react-native-elements';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

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
        return '#F19A3E';
      case 'completed':
        return '#B9FFB7';
      case 'pending':
        return '#F15152';
      default:
        return '#FFFFFF';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work':
        return 'rgb(204, 229, 255)';
      case 'personal':
        return '#DECDF5';
      case 'others':
        return '#E5DADA';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <Card
      containerStyle={{
        borderWidth: 5,
        borderColor: getPriorityColor(task.priority),
        borderRadius: 4,
        backgroundColor: getCategoryColor(task.category), 
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{task.title}</Text>
        <Text style={{ fontWeight: 'bold' }}>Priority: {task.priority?.toUpperCase() || 'LOW'}</Text>

        {currentUser && currentUser.uid == task.creator ?
          <Icon
            name="trash"
            type="font-awesome"
            color="#FF0000"
            onPress={handleDeleteTask}
          />
          : <Text>
            Assigned By: {allUsers.find(user => user.id == task.creator)?.name}</Text>
        }
      </View>
      <Card.Divider />
      <Text>Description: {task.description}</Text>
      <Text>Category: {task.category?.toUpperCase() || 'OTHERS'}</Text>

      <ButtonGroup
        buttons={['In Progress', 'Completed', 'Pending']}
        selectedIndex={task.status === 'completed' ? 1 : task.status === 'pending' ? 2 : 0}
        onPress={(index) => {
          const status = index === 1 ? 'completed' : index === 2 ? 'pending' : 'in progress';
          handleTaskStatusChange(status);
        }}
        containerStyle={{ width: '95%' }}
        buttonStyle={{ flex: 1, backgroundColor: '#FFFFFF' }}
        selectedButtonStyle={{ backgroundColor: getStatusColor(task.status) }}
        textStyle={{ color: '#000000' }}
        selectedTextStyle={{ color: '#FFFFFF' }}
      />
      <Button
        title="Edit"
        onPress={handleEditTask}
        containerStyle={{ width: '95%', alignSelf: 'center' }}
      />
      <Text style={{fontWeight: 'bold', marginTop: 10}}>*note: {task.note}</Text>
    </Card>
  );
};

export default Task;
