import React, { useEffect } from 'react';
import { TouchableOpacity, AsyncStorage } from 'react-native';

const SessionContext = React.createContext();

export const SessionProvider = ({ children }) => {
  useEffect(() => {
    const resetSessionTimer = async () => {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      if (sessionToken) {
        const now = new Date().getTime();
        console.log("Updating session timestamp to:", now); // Debugging line

        await AsyncStorage.setItem('sessionTimestamp', now.toString());
      }
    };

    const handleUserInteraction = () => {
      resetSessionTimer();
    };

    const OriginalTouchable = TouchableOpacity;
    TouchableOpacity = (props) => {
      return (
        <OriginalTouchable
          {...props}
          onPress={() => {
            handleUserInteraction();
            props.onPress && props.onPress();
          }}
        >
          {props.children}
        </OriginalTouchable>
      );
    };

    return () => {
      TouchableOpacity = OriginalTouchable;
    };
  }, []);

  return (
    <SessionContext.Provider value={{}}>
      {children}
    </SessionContext.Provider>
  );
};
