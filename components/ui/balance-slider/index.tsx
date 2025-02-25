import React, {useCallback, useMemo} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {ReText} from 'react-native-redash';

type BalanceSliderProps = {
  width: number;
  initialPercentage?: number;
  onChange?: (_: {value: number}) => void;
  totalDuration: number;
};

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

export const BalanceSlider: React.FC<BalanceSliderProps> = ({
  width,
  initialPercentage = 0.5,
  onChange,
  totalDuration,
}) => {
  const pickerWidth = width;
  const x = useSharedValue((width + pickerWidth) * initialPercentage);
  const sliderHeight = useSharedValue(4);

  const onSliderChange = useCallback(
    (percentage: number) => {
      if (onChange)
        onChange({
          value: percentage,
        });
    },
    [onChange],
  );

  const xPercentage = useDerivedValue(() => {
    return clamp((x.value - pickerWidth / 2) / width, 0, 1);
  });

  const uiXPercentage = useDerivedValue(() => {
    return xPercentage.value;
  }, []);

  const gesture = Gesture.Pan()
    .onBegin(_ => {
      sliderHeight.value = withSpring(8);
    })
    .onUpdate(event => {
      x.value = event.x + pickerWidth / 2;
      runOnJS(onSliderChange)(xPercentage.value);
    })
    .onEnd(() => {
      sliderHeight.value = withSpring(4);
    });

  const rFirstContainerStyle = useAnimatedStyle(() => {
    return {
      width: `${uiXPercentage.value * 100}%`,
    };
  }, []);

  const rLineStyle = useAnimatedStyle(() => {
    const heightDiff = (sliderHeight.value - 4) / 2;
    return {
      height: sliderHeight.value,
      transform: [{translateY: -heightDiff}],
    };
  });

  const formatTime = (seconds: number) => {
    'worklet';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const rTimeTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sliderHeight.value, [4, 8], [0.7, 1]),
    };
  });

  const text = useDerivedValue(() => {
    return formatTime(totalDuration * xPercentage.value);
  }, []);

  const totalText = useDerivedValue(() => {
    return formatTime(totalDuration);
  }, []);

  const percentageLabel = useMemo(() => {
    return (
      <Animated.View>
        <ReText text={text} style={[styles.timeText, rTimeTextStyle]} />
      </Animated.View>
    );
  }, [text]);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.sliderContainer}>
          <Animated.View
            style={[styles.line, rLineStyle, {width}]}
            hitSlop={{top: 20, bottom: 20}}>
            <Animated.View style={[styles.box, rFirstContainerStyle]} />
          </Animated.View>
        </View>
      </GestureDetector>
      <View style={styles.titlesContainer}>
        {percentageLabel}
        <ReText text={totalText} style={[styles.timeText, rTimeTextStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: '100%',
    backgroundColor: '#fff',
  },
  line: {
    height: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#363636',
  },
  container: {
    width: '100%',
  },
  titlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 6 : 0,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  sliderContainer: {
    paddingVertical: 6,
    justifyContent: 'center',
  },
});
