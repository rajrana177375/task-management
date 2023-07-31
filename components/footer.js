import React, { useState } from 'react';
import { Icon, Tab } from 'react-native-elements';

const Footer = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabPress = (index) => {
    setActiveTab(index);
    switch (index) {
      case 0:
        navigation.navigate('Tasks');
        break;
      case 1:
        navigation.navigate('Profile');
        break;
      case 2:
        navigation.navigate('TaskBoard');
        break;
      default:
        break;
    }
  };

  return (
    <Tab 
      value={activeTab} 
      onChange={handleTabPress} 
      containerStyle={{ 
        backgroundColor: '#f8f8f8', 
        borderTopWidth: 1, 
        borderTopColor: '#e7e7e7', 
        height: 64, 
        justifyContent: 'space-around' 
      }}
    >
      <Tab.Item
        // title="Tasks"
        titleStyle={activeTab === 0 ? { color: '#1976d2' } : { color: '#999' }}
        icon={<Icon name='list' type='font-awesome' size={28} color={activeTab === 0 ? '#1976d2' : '#999'} />}
      />
      <Tab.Item
        // title="Profile"
        titleStyle={activeTab === 1 ? { color: '#1976d2' } : { color: '#999' }}
        icon={<Icon name='user' type='font-awesome' size={28} color={activeTab === 1 ? '#1976d2' : '#999'} />}
      />
      <Tab.Item
        // title="Settings"
        titleStyle={activeTab === 2 ? { color: '#1976d2' } : { color: '#999' }}
        icon={<Icon name='gear' type='font-awesome' size={28} color={activeTab === 2 ? '#1976d2' : '#999'} />}
      />
    </Tab>
  );
};

export default Footer;
