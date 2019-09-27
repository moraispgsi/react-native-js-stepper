/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
  ViewPagerAndroid,
  Platform,
  View,
  Text,
  ScrollView,
  ViewPropTypes,
  Alert
} from 'react-native';
import PlatformTouchableNative from 'react-native-platform-touchable'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { styles } from './styles/styles'

type Props = {
  children: any,
  initialPage: number,
  onPressNext?: Function,
  onPressBack?: Function,
  onScrollPage?: Function,
  textButtonsStyle?: Object | number,
  backButtonTitle?: string,
  nextButtonTitle?: string,
  topStepperStyle?: Object | number,
  showTopStepper?: boolean,
  activeDotStyle?: Object | number,
  inactiveDotStyle?: Object | number,
  childrenStyle?: Object | number,
  activeStepStyle?: Object | number,
  inactiveStepStyle?: Object | number,
  steps?: Array<string>,
  stepsTitleStyle?: Object | number,
  showBottomStepper?: boolean,
  bottomStepperStyle?: Object | number,
  activeStepNumberStyle?: Object | number,
  inactiveStepNumberStyle?: Object | number,
  activeStepTitleStyle?: Object | number,
  inactiveStepTitleStyle?: Object | number,
  bottomNavigationLeftIconComponent?: React$Element<any>,
  bottomNavigationRightIconComponent?: React$Element<any>,
  error?:boolean,
}
type State = {
  showBack: boolean,
  showNext: boolean,
  width: number,
  height: number,
  page: number,
}

class Stepper extends React.Component<Props, State> {
  viewPager: ViewPagerAndroid;
  scrollView: ScrollView;

  static propTypes = {
    ...ViewPagerAndroid.propTypes,
    ...ScrollView.propTypes,
    initialPage: PropTypes.number,
    onPressNext: PropTypes.func,
    onPressBack: PropTypes.func,
    textButtonsStyle: Text.propTypes.style,
    backButtonTitle: PropTypes.string,
    nextButtonTitle: PropTypes.string,
    topStepperStyle: ViewPropTypes.style,
    showTopStepper: PropTypes.bool,
    activeDotStyle: ViewPropTypes.style,
    inactiveDotStyle: ViewPropTypes.style,
    childrenStyle: ViewPropTypes.style,
    steps: PropTypes.arrayOf(PropTypes.string.isRequired),
    stepsTitleStyle: ViewPropTypes.style,
    showBottomStepper: PropTypes.bool,
    bottomStepperStyle: ViewPropTypes.style,
    activeStepNumberStyle: Text.propTypes.style,
    inactiveStepNumberStyle: Text.propTypes.style,
    activeStepStyle: ViewPropTypes.style,
    inactiveStepStyle: ViewPropTypes.style,
    activeStepTitleStyle: Text.propTypes.style,
    inactiveStepTitleStyle: Text.propTypes.style,
    onScrollPage: PropTypes.func,
    bottomNavigationLeftIconComponent: PropTypes.element,
    bottomNavigationRightIconComponent: PropTypes.element
  };

  static defaultProps = {
    initialPage: 0,
    activeStepColor: 'brown',
    inactiveStepColor: 'grey',
    stepNumberStyle: {
      color: 'white'
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showBack: props.initialPage > 0,
      showNext: props.initialPage !== props.children.length,
      page: props.initialPage,
      width: 0,
      height: 0,
    }
  }

  /**
   * Handles bottom stepper buttons behaviour
   * @param position
   */
  handleBottomStepper = (position: number) => {
    const numberOfPages: number = this.props.children.length;
    this.setState(
        {
          showNext: position !== numberOfPages - 1,
          showBack: position !== 0,
          page: position
        });
  };

  /**
   * Handles back button behaviour
   */
  onPressBack = () => {
    if (this.props.onPressBack) {
      const canBack = this.props.onPressBack();
      if(!canBack) {
        return;
      }
    }

    this.handleBottomStepper(this.state.page - 1)
  };

  /**
   * Handles next button behaviour
   */
  onPressNext = () => {
    if (this.props.onPressNext) {
      const canNext = this.props.onPressNext();
      if(!canNext) {
        return;
      }
    }

    this.handleBottomStepper(this.state.page + 1)
  };

  renderDots = () => {
    let dots = [];
    const { activeDotStyle, inactiveDotStyle } = this.props;

    for (let index = 0; index < this.props.children.length; index++) {
      const isSelected: boolean = this.state.page === index;
      dots.push(
          <View
              style={[styles.dot, isSelected ? activeDotStyle : inactiveDotStyle]}
              key={index}
          />
      )
    }
    return <View style={styles.dotsContainer}>{dots}</View>
  };

  renderSteps = () => {
    const {
      activeStepStyle,
      inactiveStepStyle,
      steps,
      activeStepTitleStyle,
      inactiveStepTitleStyle,
      activeStepNumberStyle,
      inactiveStepNumberStyle
    } = this.props;

    if (steps) {
      return steps.map((step: string, index: number) => {
        const isSelected: boolean = this.state.page === index;
        return (
            <View key={`step${index}`} style={styles.stepContainer}>
              <View
                  style={[
                    styles.steps,
                    isSelected ? activeStepStyle : inactiveStepStyle
                  ]}>
                {index < this.state.page ? (
                    this.props.error ? (
                        <MaterialIcon
                            name="close"
                            size={24}
                            style={
                              isSelected
                                  ? activeStepNumberStyle
                                  : inactiveStepNumberStyle
                            }
                        />
                    ) : (
                        <MaterialIcon
                            name="check"
                            size={24}
                            style={
                              isSelected
                                  ? activeStepNumberStyle
                                  : inactiveStepNumberStyle
                            }
                        />
                    )
                ) : (
                    <Text
                        style={
                          isSelected ? activeStepNumberStyle : inactiveStepNumberStyle
                        }>
                      {index + 1}
                    </Text>
                )}
              </View>
              <Text
                  style={[
                    styles.stepTitle,
                    isSelected ? activeStepTitleStyle : inactiveStepTitleStyle
                  ]}>
                {step}
              </Text>
            </View>
        )
      })
    }
    return null
  };

  render() {
    const {
      showTopStepper,
      showBottomStepper,
      textButtonsStyle,
      backButtonTitle,
      nextButtonTitle,
      topStepperStyle,
      bottomStepperStyle,
      bottomNavigationLeftIconComponent,
      bottomNavigationRightIconComponent
    } = this.props;
    const { showBack, showNext } = this.state;
    return (
        <View style={styles.container}>
          {showTopStepper ? (
              <View style={[styles.topStepper, topStepperStyle]}>
                {this.renderSteps()}
              </View>
          ) : null}
          <ScrollView style={{ backgroundColor: 'white' }}>
            {this.props.children[this.state.page]}
          </ScrollView>
          {showBottomStepper ? (
              <View
                  style={[
                    styles.bottomStepper,
                    {
                      justifyContent: showBack ? 'space-between' : 'flex-end'
                    },
                    bottomStepperStyle
                  ]}>
                {showBack ? (
                    <PlatformTouchableNative
                        onPress={this.onPressBack}
                        background={PlatformTouchableNative.SelectableBackgroundBorderless()}
                        style={{ zIndex: 1 }}>
                      <View style={styles.button}>
                        {bottomNavigationLeftIconComponent || (
                            <MaterialIcon name="navigate-before" size={24} />
                        )}
                        <Text style={[styles.bottomTextButtons, textButtonsStyle]}>
                          {backButtonTitle}
                        </Text>
                      </View>
                    </PlatformTouchableNative>
                ) : null}
                {this.renderDots()}
                {showNext && !this.props.error ? (
                    <PlatformTouchableNative
                        onPress={this.onPressNext}
                        background={PlatformTouchableNative.SelectableBackgroundBorderless()}
                        style={{ zIndex: 1 }}>
                      <View style={styles.button}>
                        <Text style={[styles.bottomTextButtons, textButtonsStyle]}>
                          {nextButtonTitle}
                        </Text>
                        {bottomNavigationRightIconComponent || (
                            <MaterialIcon name="navigate-next" size={24} />
                        )}
                      </View>
                    </PlatformTouchableNative>
                ) : null}
              </View>
          ) : null}
        </View>
    )
  }
}

export default Stepper
