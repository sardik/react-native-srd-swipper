import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Animated, useWindowDimensions, View } from "react-native";
import SardiSwipperPagination from "./SardiSwipperPagination";

const SardiSwipper = (props) => {
  const { width: deviceWidth } = useWindowDimensions();
  const swiper = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const wait = new Promise((resolve) => setTimeout(resolve, 500));

  const {
    data,
    renderItem,
    width,
    height,
    index,
    setIndex,
    auto,
    duration,
    space,
    spaceLastItem,
    horizontal,
    dotWidth,
    dotHeight,
    dotActiveWidth,
    dotActiveHeight,
    dotBorderRadius,
    dotBorderRadiusActive,
    dotColor,
    dotColorActive,
    style,
    indicatorStyle,
  } = props;

  const slidesData = horizontal === true ? [...data, {}] : data;
  const dataLength = data.length - 1;

  let counter = 0;
  useEffect(() => {
    if (auto === true) {
      setInterval(() => {
        counter++;

        if (counter <= dataLength) {
          swiper.current.scrollToIndex({ animated: true, index: counter });
        } else {
          swiper.current.scrollToIndex({ animated: true, index: 0 });
          counter = 0;
        }
      }, duration);
    }
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setIndex(viewableItems[0]?.index);
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    { onViewableItemsChanged },
  ]).current;

  return (
    <View>
      <View style={[{ height: height }, style]}>
        <Animated.FlatList
          ref={swiper}
          initialScrollIndex={index}
          data={slidesData}
          bounces={false}
          horizontal={horizontal}
          pagingEnabled
          snapToAlignment={"start"}
          snapToInterval={horizontal === true ? width + space : height}
          decelerationRate={"fast"}
          windowSize={5}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          removeClippedSubviews={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `swiper-item-${index}`}
          renderItem={({ item, index }) => {
            if (slidesData.length - 1 === index && horizontal === true) {
              return spaceLastItem ? (
                <View style={{ width: deviceWidth - (width + space) }} />
              ) : null;
            }

            return renderItem({
              item,
              index,
              scroll: horizontal ? scrollX : scrollY,
            });
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX, y: scrollY } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={({ nativeEvent }) => {
            setIndex(
              horizontal === true
                ? Math.round(
                    nativeEvent.contentOffset.x /
                      nativeEvent.layoutMeasurement.width
                  )
                : Math.round(
                    nativeEvent.contentOffset.y /
                      nativeEvent.layoutMeasurement.height
                  )
            );
          }}
          onScrollToIndexFailed={(info) => {
            wait.then(() => {
              swiper.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          ItemSeparatorComponent={() => <View style={{ width: space }} />}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        />
      </View>
      <SardiSwipperPagination
        data={data}
        scroll={horizontal === true ? scrollX : scrollY}
        currentIndex={index}
        width={width}
        height={height}
        horizontal={horizontal}
        dotWidth={dotWidth}
        dotHeight={dotHeight}
        dotActiveWidth={dotActiveWidth}
        dotActiveHeight={dotActiveHeight}
        borderRadius={dotBorderRadius}
        borderRadiusActive={dotBorderRadiusActive}
        color={dotColor}
        colorActive={dotColorActive}
        style={indicatorStyle}
      />
    </View>
  );
};

SardiSwipper.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
  auto: PropTypes.bool,
  duration: PropTypes.number,
  space: PropTypes.number,
  spaceLastItem: PropTypes.bool,
  horizontal: PropTypes.bool,
  dotWidth: PropTypes.number,
  dotHeight: PropTypes.number,
  dotActiveWidth: PropTypes.number,
  dotActiveHeight: PropTypes.number,
  dotBorderRadius: PropTypes.number,
  dotBorderRadiusActive: PropTypes.number,
  dotColor: PropTypes.string,
  dotColorActive: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  indicatorStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

SardiSwipper.defaultProps = {
  auto: false,
  duration: 3000,
  space: 0,
  spaceLastItem: false,
  horizontal: true,
  dotWidth: 8,
  dotHeight: 8,
  dotActiveWidth: 24,
  dotActiveHeight: 8,
  dotBorderRadius: 4,
  dotBorderRadiusActive: 4,
  dotColor: "#cccccc",
  dotColorActive: "#666666",
};

export default SardiSwipper;
