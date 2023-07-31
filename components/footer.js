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
    <Tab value={activeTab} onChange={handleTabPress} containerStyle={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ccc', height: 56 }}>
      <Tab.Item icon={<Icon name='list' type='font-awesome' size={20} color='#999' />} />

      <Tab.Item icon={<Icon name='user' type='font-awesome' size={20} color='#999' />} />

      <Tab.Item icon={<Icon name='gear' type='font-awesome' size={20} color='#999' />} />

    </Tab>
  );
};

export default Footer;
