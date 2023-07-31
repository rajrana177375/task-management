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
      case 2:
        navigation.navigate('Profile');
        break;
      case 1:
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
        titleStyle={activeTab === 0 ? { color: '#F9A825' } : { color: '#999' }} // Darker Yellow
        icon={<Icon name='list' type='font-awesome' size={28} color={activeTab === 0 ? '#F9A825' : '#999'} />}
      />
      <Tab.Item
        titleStyle={activeTab === 1 ? { color: '#F9A825' } : { color: '#999' }}
        icon={<Icon name='table' type='font-awesome' size={28} color={activeTab === 1 ? '#F9A825' : '#999'} />}
      />
      <Tab.Item
        titleStyle={activeTab === 2 ? { color: '#F9A825' } : { color: '#999' }}
        icon={<Icon name='user' type='font-awesome' size={28} color={activeTab === 2 ? '#F9A825' : '#999'} />}
      />
    </Tab>
  );
};

export default Footer;
