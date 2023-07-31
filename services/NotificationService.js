import * as Notifications from 'expo-notifications';
import { doc, getDocs, collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function scheduleTaskNotifications(userId, expoPushToken) {
    let currentUser = auth.currentUser;

    const tasksRef = collection(db, 'tasks');
    let q = query(tasksRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
        let userTasks = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        userTasks = userTasks.filter(el => el.collaborators.find(uid => uid == currentUser.uid) || el.creator == currentUser.uid)

        userTasks.forEach((doc) => {
            const task = doc;
            const dueDate = new Date(task.dueDate.seconds * 1000); 

            const notificationDate = new Date(dueDate);
            notificationDate.setDate(notificationDate.getDate() - 1);

            if (notificationDate < new Date()) return;

            Notifications.scheduleNotificationAsync({
                content: {
                    title: `Task due soon!`,
                    body: `Your task '${task.title}' is due tomorrow!`,
                    data: { taskId: doc.id },
                },
                // trigger: { seconds: 2 },
                trigger: { date: notificationDate },
            });
        });

    });
    return unsubscribe;
}

export async function rescheduleTaskNotifications(userId, expoPushToken) {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    for (let notification of notifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }

    await scheduleTaskNotifications(userId, expoPushToken);
}

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}
