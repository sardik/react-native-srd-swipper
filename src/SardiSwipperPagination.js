import React from "react";
import PropTypes from "prop-types";
import { Animated, View } from "react-native";

const SardiSwipperPagination = (props) => {
  const {
    data,
    scroll,
    currentIndex,
    width,
    height,
    horizontal,
    dotWidth,
    dotHeight,
    dotActiveWidth,
    dotActiveHeight,
    borderRadius,
    borderRadiusActive,
    color,
    colorActive,
    style,
  } = props;

  const loopInterpolate = ({ arrGroup, activeValue, baseValue }) => {
    if (!Array.isArray(data)) return arrGroup;
    for (let i = 0; i < data.length; i++) {
      const inputRangeDyn =
        horizontal === true
          ? [
              (currentIndex - 1) * width,
              currentIndex * width,
              (currentIndex + 1) * width,
            ]
          : [
              (currentIndex - 1) * height,
              currentIndex * height,
              (currentIndex + 1) * height,
            ];

      if (currentIndex === i) {
        const scale = scroll.interpolate({
          inputRange: inputRangeDyn,
          outputRange: [baseValue, activeValue, baseValue],
        });
        arrGroup.push(scale);
      }

      if (currentIndex + 1 === i) {
        const scale = scroll.interpolate({
          inputRange: inputRangeDyn,
          outputRange: [baseValue, baseValue, activeValue],
        });
        arrGroup.push(scale);
      }

      if (currentIndex - 1 === i) {
        const scale = scroll.interpolate({
          inputRange: inputRangeDyn,
          outputRange: [activeValue, baseValue, baseValue],
        });
        arrGroup.push(scale);
      }

      if (Math.abs(currentIndex - i) >= 2) {
        arrGroup.push(baseValue);
      }
    }

    return arrGroup;
  };

  const transformSizeX = () => {
    const arrGroup = [];
    if (!dotActiveWidth) {
      for (let i = 0; i < data.length; i++) {
        arrGroup.push(dotWidth);
      }
      return arrGroup;
    }

    return loopInterpolate({
      arrGroup,
      baseValue: dotWidth,
      activeValue: dotActiveWidth,
    });
  };

  const transformSizeY = () => {
    const arrGroup = [];
    if (!dotActiveHeight) {
      for (let i = 0; i < data.length; i++) {
        arrGroup.push(dotHeight);
      }
      return arrGroup;
    }

    return loopInterpolate({
      arrGroup,
      baseValue: dotHeight,
      activeValue: dotActiveHeight,
    });
  };

  const transformRadius = () => {
    const arrGroup = [];
    if (!borderRadiusActive) {
      for (let i = 0; i < data.length; i++) {
        arrGroup.push(borderRadius);
      }
      return arrGroup;
    }

    return loopInterpolate({
      arrGroup,
      baseValue: borderRadius,
      activeValue: borderRadiusActive,
    });
  };

  const transformColor = () => {
    const arrGroup = [];
    if (!colorActive) {
      for (let i = 0; i < data.length; i++) {
        arrGroup.push(color);
      }
      return arrGroup;
    }

    return loopInterpolate({
      arrGroup,
      baseValue: color,
      activeValue: colorActive,
    });
  };

  const animateX = transformSizeX();
  const animateY = transformSizeY();
  const animateColor = transformColor();
  const animateRadius = transformRadius();

  return (
    <View
      style={[
        {
          flexDirection: horizontal === true ? "row" : "column",
          paddingVertical: dotWidth,
        },
        style,
      ]}
    >
      {data.map((item, index) => {
        return (
          <Animated.View
            key={`dot-swiper-${index}`}
            style={[
              {
                width: animateX[index],
                height: animateY[index],
                backgroundColor: animateColor[index],
                borderRadius: animateRadius[index],
                marginHorizontal: horizontal === true ? dotWidth / 2 : 0,
                marginVertical: horizontal === false ? dotWidth / 2 : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

SardiSwipperPagination.propTypes = {
  data: PropTypes.array,
  scroll: PropTypes.object,
  currentIndex: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  horizontal: PropTypes.bool,
  dotWidth: PropTypes.number,
  dotHeight: PropTypes.number,
  dotActiveWidth: PropTypes.number,
  dotActiveHeight: PropTypes.number,
  borderRadius: PropTypes.number,
  borderRadiusActive: PropTypes.number,
  color: PropTypes.string,
  colorActive: PropTypes.string,
};

SardiSwipperPagination.defaultProps = {
  horizontal: true,
  dotWidth: 8,
  dotHeight: 8,
  dotActiveWidth: 24,
  dotActiveHeight: 8,
  borderRadius: 4,
  borderRadiusActive: 4,
  color: "#cccccc",
  colorActive: "#666666",
};

export default SardiSwipperPagination;
