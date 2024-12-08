import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Screen from './index';
import SettingTab from "~/app/(tabs)/setting";
import {MyTabBar} from "~/components/TabBar";


const _layout = createBottomTabNavigator();
export default function MyTabs() {
  return (
    <_layout.Navigator tabBar={props => <MyTabBar {...props} />}>
      <_layout.Screen name="Dashboard" component={Screen}/>
      <_layout.Screen name="MQTT Tester" component={SettingTab}/>
    </_layout.Navigator>
  );
}