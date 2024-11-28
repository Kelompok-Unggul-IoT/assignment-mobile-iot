import * as React from 'react';
import {View} from 'react-native';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '~/components/ui/card';
import {Text} from '~/components/ui/text';
import {Switch} from '~/components/ui/switch';
import {Label} from '~/components/ui/label';
import {Button} from "~/components/ui/button";
import mqtt from "mqtt"; // import namespace "mqtt"

const client = mqtt.connect("ws://mqtt.rekycode.id:9001", {
  port: 9001,
  clientId: "mqtt_rn",
  username: "reky",
  password: "reky.iot",
});
export default function Screen() {
  const [temperature, setTemperature] = React.useState(0);
  const [humidity, setHumidity] = React.useState(0);
  const [lumen, setLumen] = React.useState(0);

  const [lamp1state, setLamp1State] = React.useState(false);
  const [lamp2state, setLamp2State] = React.useState(false);
  const [lamp3state, setLamp3State] = React.useState(false);

  client.on("message", (topic, message) => {
    const data = JSON.parse(message.toString());
    setTemperature(data.temperature);
    setHumidity(data.humidity);
    setLumen(data.lumen);
  });

  client.on("connect", function () {
    client.subscribe("iot/sensor/#");
  });

  client.on("error", function (error) {
    console.log("Can't connect" + error);
  });

  client.on('disconnect', function () {
    console.log("Disconnected");
  });

  const switchLamp = (lamp: number) => {
    if (lamp === 1) {
      console.log("switch lamp 1 state into", !lamp1state);
      setLamp1State(!lamp1state);
      client.publish("iot/sensor/lamp", JSON.stringify({ "lamp_id": 1, "action": lamp1state ? "TURN_OFF" : "TURN_ON" }));
    } else if (lamp === 2) {
      console.log("switch lamp 2 state into", !lamp2state);
      setLamp2State(!lamp2state);
      client.publish("iot/sensor/lamp", JSON.stringify({ "lamp_id": 2, "action": lamp2state ? "TURN_OFF" : "TURN_ON" }));
    } else if (lamp === 3) {
      console.log("switch lamp 3 state into", !lamp3state);
      setLamp3State(!lamp3state);
      client.publish("iot/sensor/lamp", JSON.stringify({ "lamp_id": 3, "action": lamp3state ? "TURN_OFF" : "TURN_ON" }));
    }
  }

  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <Card className='w-full max-w-sm p-6 rounded-2xl'>
        <CardHeader className='items-center'>
          <View className='p-3' />
          <CardTitle className='pb-2 text-center'>Kelompok Unggul IoT</CardTitle>
          <View className='flex-row'>
            <CardDescription className='text-base font-semibold'>Mqtt x Mobile</CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className='flex-row justify-around gap-5'>
            <View className='items-center'>
              <Text className='text-sm text-muted-foreground'>Humidity</Text>
              <Text className='text-xl font-semibold'>{humidity}%</Text>
            </View>
            <View className='items-center'>
              <Text className='text-sm text-muted-foreground'>Temperature</Text>
              <Text className='text-xl font-semibold'>{temperature}</Text>
            </View>
            <View className='items-center'>
              <Text className='text-sm text-muted-foreground'>Lumen</Text>
              <Text className='text-xl font-semibold'>{lumen}</Text>
            </View>
          </View>
          <View className='flex-row justify-around gap-5 mt-6'>
             <View className='flex-row items-center gap-2'>
               <Switch checked={lamp1state} onCheckedChange={() => {switchLamp(1)}} nativeID='airplane-mode' aria-label={'aaa'}/>
               <Label className='text-xl font-semibold'>Lamp 1</Label>
             </View>
          </View>
          <View className='flex-row justify-around gap-3 mt-2'>
             <View className='flex-row items-center gap-2'>
               <Switch checked={lamp2state} onCheckedChange={() => {switchLamp(2)}} nativeID='airplane-mode' aria-label={'aaa'}/>
               <Label className='text-xl font-semibold'>Lamp 2</Label>
             </View>
          </View>
          <View className='flex-row justify-around gap-3 mt-2'>
             <View className='flex-row items-center gap-2'>
               <Switch checked={lamp3state} onCheckedChange={() => {switchLamp(3)}} nativeID='airplane-mode' aria-label={'aaa'}/>
               <Label className='text-xl font-semibold'>Lamp 3</Label>
             </View>
          </View>
        </CardContent>
        <CardFooter className='flex-col gap-3 pb-0 mt-2 mb-2'>
          <View className='flex-row justify-around gap-3'>
            <Button onPress={() => {
              console.log("turn on all lamp");
              client.publish("iot/sensor/lamp", JSON.stringify({"action": "TURN_ON_ALL"}));
              setLamp1State(true);
              setLamp2State(true);
              setLamp3State(true);
            }}>
              <Text>Turn On All Lamp</Text>
            </Button>
            <Button onPress={() => {
              console.log("turn off all lamp");
              client.publish("iot/sensor/lamp", JSON.stringify({"action": "TURN_OFF_ALL"}));
              setLamp1State(false);
              setLamp2State(false);
              setLamp3State(false);
            }}>
              <Text>Turn Off All Lamp</Text>
            </Button>
          </View>
        </CardFooter>
      </Card>
    </View>
  );
}