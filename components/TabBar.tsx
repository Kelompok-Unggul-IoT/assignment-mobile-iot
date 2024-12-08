import { View, Platform } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import {BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import {Feather} from "@expo/vector-icons";
import {LabelPosition} from "@react-navigation/bottom-tabs/src/types";
import React from "react";

export function MyTabBar({ state, descriptors, navigation } : BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label : string | ((props: {
          focused: boolean;
          color: string;
          position: LabelPosition;
          children: string
        }) => React.ReactNode) =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        let icon_name = 'home';
        if(label === 'MQTT Tester'){
          icon_name = 'server';
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // @ts-ignore
        return (
          <PlatformPressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabitem}
          >
            <Feather size={24} color={isFocused ? colors.primary : colors.text}  name={icon_name}/>
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 200,
    backgroundColor: Platform.OS === 'web' ? 'transparent' : '#F4F4F5',
    borderRadius: 35,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabitem:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  }
});