import React from 'react';
import type { LayoutRectangle } from 'react-native';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { SectionTabs } from './section-tab';

export type TabData = {
  id: string;
  title: string;
};
const data: TabData[] = [
  {id: '1', title: 'TIẾP THEO'},
  {id: '2', title: 'LỜI NHẠC'},
  {id: '3', title: 'LIÊN QUAN'},
];

type DynamicTabIndicatorProps = {
  progress: SharedValue<number>;
};

const DynamicTabIndicator: React.FC<DynamicTabIndicatorProps> = React.memo(
  ({progress}) => {
    const indicatorLayout = useSharedValue<LayoutRectangle>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    const layouts = useSharedValue<LayoutRectangle[]>([]);
    const {width, height} = useWindowDimensions();
    const scrollRef = React.useRef<Animated.ScrollView>(null);

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: event => {
        const inputRange = data.map((_, index) => {
          return index * width;
        });

        const xOutputRange = data.map((_, index) => {
          const defaultX = (index * width) / data.length;

          return layouts.value[index]?.x ?? defaultX;
        });
        const widthOutputRange = data.map(() => width / 3);

        indicatorLayout.value = {
          ...indicatorLayout.value,
          x: interpolate(
            event.contentOffset.x,
            inputRange,
            xOutputRange,
            Extrapolation.CLAMP,
          ),
          width: interpolate(
            event.contentOffset.x,
            inputRange,
            widthOutputRange,
            Extrapolation.CLAMP,
          ),
        };
      },
    });

    const rContentShowStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(progress.value, [0, 1, 2], [0, 0, 1]),
      };
    });

    return (
      <>
        <SectionTabs
          indicatorLayout={indicatorLayout}
          layouts={layouts}
          progress={progress}
          data={data.map(item => item.title)}
          onSelectSection={index => {
            if (progress.value < 2) {
              return;
            }
            scrollRef.current?.scrollTo({
              x: index * width,
            });
          }}
        />
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          onScroll={scrollHandler}
          style={rContentShowStyle}
          scrollEventThrottle={16}>
          {data.map((item, index) => (
            <View key={index} style={{flex: 1}}>
              {item.id === '1' && (
                <View
                  style={{
                    backgroundColor: 'red',
                    width: width,
                    flex: 1,
                    height: height,
                  }}
                />
              )}
              {item.id === '2' && (
                <View
                  style={{
                    backgroundColor: 'blue',
                    width: width,
                    flex: 1,
                    height: height,
                  }}
                />
              )}
              {item.id === '3' && (
                <View
                  style={{
                    backgroundColor: 'green',
                    width: width,
                    flex: 1,
                    height: height,
                  }}
                />
              )}
            </View>
          ))}
        </Animated.ScrollView>
      </>
    );
  },
);

export { DynamicTabIndicator };
