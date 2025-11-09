import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Audit from '@/screens/Audit';
import Attestation from '@/screens/Attestation';
import Materials from '@/screens/Materials';
import Menu from '@/screens/Menu';
import Trends from '@/screens/Trends';
import Tech from '@/screens/Tech';
import Settings from '@/screens/Settings';
import i18n from '@/i18n';

const Tab = createBottomTabNavigator();

export default function Tabs(){
  return (
    <Tab.Navigator screenOptions={({route})=>({
      headerShown:false, tabBarActiveTintColor:'#8B1E2D',
      tabBarIcon:({color,size})=>{
        const map:Record<string, keyof typeof Ionicons.glyphMap>={
          Audit:'clipboard-outline', Attestation:'school-outline', Materials:'library-outline',
          Menu:'restaurant-outline', Trends:'trending-up-outline', Tech:'build-outline', Settings:'settings-outline'
        };
        return <Ionicons name={map[route.name]||'ellipse-outline'} size={size} color={color}/>;
      }
    })}>
      <Tab.Screen name="Audit" component={Audit} options={{ title:i18n.t('tabs.Audit') }}/>
      <Tab.Screen name="Attestation" component={Attestation} options={{ title:i18n.t('tabs.Attestation') }}/>
      <Tab.Screen name="Materials" component={Materials} options={{ title:i18n.t('tabs.Materials') }}/>
      <Tab.Screen name="Menu" component={Menu} options={{ title:i18n.t('tabs.Menu') }}/>
      <Tab.Screen name="Trends" component={Trends} options={{ title:i18n.t('tabs.Trends') }}/>
      <Tab.Screen name="Tech" component={Tech} options={{ title:i18n.t('tabs.Tech') }}/>
      <Tab.Screen name="Settings" component={Settings} options={{ title:i18n.t('tabs.Settings') }}/>
    </Tab.Navigator>
  );
}
