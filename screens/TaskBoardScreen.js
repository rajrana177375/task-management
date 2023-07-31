import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

const TaskBoardScreen = () => {
    const [tasks, setTasks] = useState([
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true },
        { id: '3', title: 'Task 3', completed: false },
        //... add more tasks as needed
    ]);

    const renderItem = ({ item, index, drag, isActive }) => {
        return (
            <TouchableOpacity
                style={styles.task(isActive)}
                onLongPress={drag}
            >
                <Text style={styles.text}>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <DraggableFlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item, index) => `draggable-item-${item.id}`}
                onDragEnd={({ data }) => setTasks(data)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingTop: 40,
    },
    task: (isActive) => ({
        backgroundColor: isActive ? '#6e3b6e' : '#fff',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    }),
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default TaskBoardScreen;
