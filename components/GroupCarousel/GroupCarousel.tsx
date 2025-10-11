import { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { FlyingBirds } from '@/components/FlyingBirds/FlyingBirds';
import { BackgroundImage } from '@/components/GroupCarousel/BackgroundImage';
import { CardBackground } from '@/components/GroupCarousel/CardBackground';
import { colors } from '@/config/colors';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { GroupType } from '@/types/Groups';
import { subheading } from '@/utils/text';

const VISIBLE_ITEMS = 2.5;
const PADDING = 40;

interface GroupCarouselProps {
  options: string[];
  selectedOption: string;
  groupType: GroupType;
  groups: Record<string, any>;
  setSelectedOption: (_option: string) => void;
}

type CardProps = {
  isIndoor: boolean;
  title: string;
  unit: string;
};

export const GroupCarousel = ({
  options,
  groupType,
  groups,
  selectedOption,
  setSelectedOption,
}: GroupCarouselProps) => {
  const carouselRef = useRef<any>(null);
  const parallaxOffset = useSharedValue(0);

  const deviceWidth = Dimensions.get('window').width;
  const itemWidth = (deviceWidth - PADDING) / VISIBLE_ITEMS;
  const textColor = GROUPING_CONFIGS[groupType].foregroundColor;

  const getFontSize = (size: number) => {
    if (size === 1) {
      return 80;
    }

    if (size < 5) {
      return 50;
    }

    if (size < 6) {
      return 40;
    }

    if (size < 7) {
      return 30;
    }

    return 20;
  };

  const Card = ({ isIndoor, title, unit }: CardProps) => (
    <>
      <CardBackground />

      <View style={styles.carouselItemContent}>
        {isIndoor && (
          <View style={styles.indoorLabel}>
            <Text style={styles.indoorLabelText}>Indoor</Text>
          </View>
        )}

        <Text
          style={[
            styles.carouselText,
            {
              color: textColor,
              fontSize: getFontSize(title.length),
            },
          ]}
        >
          {title}
        </Text>

        <Text style={[styles.carouselSubText, { color: textColor }]}>{unit}</Text>
      </View>
    </>
  );

  return (
    <View style={styles.carouselContainer}>
      <BackgroundImage
        groupType={groupType}
        parallaxOffset={parallaxOffset}
        selectedOption={selectedOption}
      />

      <FlyingBirds count={3} />

      <Carousel
        ref={carouselRef}
        width={itemWidth}
        loop={false}
        height={180}
        data={options.length > 0 ? options : ['--']}
        scrollAnimationDuration={300}
        onSnapToItem={(index) => {
          setSelectedOption(options[index]);
        }}
        onProgressChange={(offsetProgress) => {
          parallaxOffset.value = offsetProgress * 100;
        }}
        style={styles.carousel}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 60,
          parallaxAdjacentItemScale: 0.7,
        }}
        renderItem={({ item }) => {
          const group = groups[item];
          const isIndoor = group?.isIndoor || false;
          const title = group?.title || item;
          const unit = group?.unit || '';

          return (
            <View style={styles.carouselItemContainer}>
              <View style={styles.carouselItem}>
                <Card
                  isIndoor={isIndoor}
                  title={title}
                  unit={unit}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  carousel: {
    marginTop: 200,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    overflow: 'visible',
    zIndex: 10,
  },
  carouselItemContainer: {
    alignItems: 'center',
  },
  carouselItemContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  carouselItem: {
    width: 140,
    height: 150,
    marginHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#555555',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
  },
  carouselText: {
    verticalAlign: 'middle',
    lineHeight: 80,
    textAlign: 'center',
    fontSize: 80,
    fontWeight: 'bold',
    fontFamily: 'OrelegaOne',
    color: colors.other,
  },
  carouselSubText: {
    ...subheading,
    marginTop: 0,
    textAlign: 'center',
    color: colors.other,
  },
  indoorLabel: {
    backgroundColor: '#ff4800',
    position: 'absolute',
    textAlign: 'center',
    top: -10,
    borderRadius: 8,
    width: 70,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  indoorLabelText: {
    ...subheading,
    marginTop: 0,
    textAlign: 'center',
    marginBottom: 0,
    color: colors.neutral,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
