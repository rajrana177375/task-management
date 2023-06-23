import { Text } from 'react-native';
import { Card } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

const Task = ({ task, onEditTask }) => {

  const handleEditTask = () => {
    onEditTask(task);
  };

  const dueDate = task.dueDate ? task.dueDate.toDate() : null;

  return (
    <Card>
      <Card.Title>{task.title}</Card.Title>
      <Card.Divider />
      <Text>Description: {task.description}</Text>
      {dueDate && isValidDate(dueDate) && (
        <Text>Due Date: {dueDate.toLocaleDateString()}</Text>
      )}
            <FontAwesome
        name="pencil"
        size={20}
        onPress={handleEditTask}
        style={styles.editIcon}
      />
    </Card>
  );
};

const isValidDate = (date) => {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
};

const styles = {
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
};

export default Task;
