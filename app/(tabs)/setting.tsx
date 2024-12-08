import { View, Text } from 'react-native';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Button} from "~/components/ui/button";
import * as React from "react";
import { Input } from '~/components/ui/input';
import Paho from 'paho-mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingTab() {
  const [server, setServer] = React.useState('mqtt.rekycode.id');
  const [port, setPort] = React.useState('9001');
  const [username, setUsername] = React.useState('reky');
  const [password, setPassword] = React.useState('reky.iot');
  const saveSetting = async () => {
    try {
      await AsyncStorage.setItem('mqtt_server', server);
      await AsyncStorage.setItem('mqtt_port', port);
      await AsyncStorage.setItem('mqtt_username', username);
      await AsyncStorage.setItem('mqtt_password', password);
    } catch (e) {
      console.log(e);
    }
  }

  const loadSetting = async () => {
    try {
      const server = await AsyncStorage.getItem('mqtt_server');
      const port = await AsyncStorage.getItem('mqtt_port');
      const username = await AsyncStorage.getItem('mqtt_username');
      const password = await AsyncStorage.getItem('mqtt_password');
      setServer(server);
      setPort(port);
      setUsername(username);
      setPassword(password);
    } catch (e) {
      console.log(e);
    }
  }

  const testConnection = () => {
    console.log('Testing connection on ' + server + ' with username ' + username + ' and password ' + password);
    const client = new Paho.Client(server, Number(port), 'MQTT_TEST_CONNECTION');
    client.connect({
      userName: username,
      password: password,
      onSuccess: () => {
        console.log('Connected');
        alert('Connected');
      },
      onFailure: (err) => {
        console.log('Failed to connect', err);
        alert('Failed to connect ' + err.errorMessage);
      }
    });
  }

  React.useEffect(() => {
    loadSetting().then(r => console.log('Setting loaded'));
  }, []);

  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <Card className='w-full max-w-sm p-6 rounded-2xl'>
        <CardHeader className='items-center'>
          <View className='p-3' />
          <CardTitle className='pb-2 text-center'>MQTT Server Tester</CardTitle>
          <View className='flex-row'>
            <CardDescription className='text-base font-semibold'>Naufal Reky Ardhana (4.33.22.0.21)</CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className='flex-col gap-3'>
            <Label>Server</Label>
            <Input placeholder={server} value={server} onChangeText={setServer} />
            <Label>Port</Label>
            <Input placeholder={port} value={port} onChangeText={setPort} />
            <Label>Username</Label>
            <Input placeholder={username} value={username} onChangeText={setUsername} />
            <Label>Password</Label>
            <Input placeholder={password} value={password} onChangeText={setPassword} />
          </View>
        </CardContent>
        <CardFooter className='flex-col gap-3 pb-0 mt-2 mb-2'>
          <View className='flex-row justify-around gap-3'>
            <Button onPress={saveSetting} className='flex-1'><Text className={'text-white'}>Save</Text></Button>
            <Button onPress={testConnection} className='flex-1'><Text className={'text-white'}>Check</Text></Button>
          </View>
        </CardFooter>
      </Card>
    </View>
  );
}