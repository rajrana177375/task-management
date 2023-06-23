import { db } from '../services/firebase';
import { Text } from 'react-native';
import { Card, Button, ButtonGroup } from 'react-native-elements';
import { updateDoc, doc } from 'firebase/firestore';

const Task = ({ task, onEditTask }) => {
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

  return (
    <Card>
      <Card.Title>{task.title}</Card.Title>
      <Card.Divider />
      <Text>Description: {task.description}</Text>
      <ButtonGroup
        buttons={['In Progress', 'Completed', 'Pending']}
        selectedIndex={task.status === 'completed' ? 1 : task.status === 'pending' ? 2 : 0}
        onPress={(index) => {
          const status = index === 1 ? 'completed' : index === 2 ? 'pending' : 'in progress';
          handleTaskStatusChange(status);
        }}
        buttonStyle={{ backgroundColor: '#FFFFFF' }}
        selectedButtonStyle={{ backgroundColor: getStatusColor(task.status) }}
        textStyle={{ color: '#000000' }}
        selectedTextStyle={{ color: '#FFFFFF' }}
      />
      <Button
        title="Edit"
        onPress={handleEditTask}
      />
    </Card>
  );
};

export default Task;
