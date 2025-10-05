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
import { subheading, uppercase } from '@/utils/text';

const VISIBLE_ITEMS = 2.5;
const PADDING = 40;

interface GroupCarouselProps {
  options: string[];
  selectedOption: string;
  groupType: GroupType;
  groups: Record<string, any>;
  setSelectedOption: (_option: string) => void;
}

export const GroupCarousel = ({
  options,
  groupType,
  groups,
  selectedOption,
  setSelectedOption,
}: GroupCarouselProps) => {
  const carouselRef = useRef<any>(null);
  const parallaxOffset = useSharedValue(0);
  const backgroundColor = GROUPING_CONFIGS[groupType].backgroundColor;
  const deviceWidth = Dimensions.get('window').width;
  const itemWidth = (deviceWidth - PADDING) / VISIBLE_ITEMS;

  type CardProps = {
    isIndoor: boolean;
    title: string;
    unit: string;
    skippedCount: number;
    backgroundColor: string;
  };

  const Card = ({ isIndoor, title, unit, skippedCount, backgroundColor }: CardProps) => (
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
              color: backgroundColor,
              fontSize: title.length > 6 ? 30 : title.length >= 5 ? 50 : 80,
            },
          ]}
        >
          {title}
        </Text>

        <Text style={[styles.carouselSubText, { color: backgroundColor }]}>{unit}</Text>
      </View>

      {skippedCount > 0 && (
        <View style={styles.excludedIndicator}>
          <Text style={styles.excludedIndicatorText}>{skippedCount} excluded</Text>
        </View>
      )}
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
          const skippedCount = group?.skipped || 0;
          const title = group?.title || item;
          const unit = group?.unit || '';

          return (
            <View style={styles.carouselItemContainer}>
              <View style={styles.carouselItem}>
                <Card
                  isIndoor={isIndoor}
                  title={title}
                  unit={unit}
                  skippedCount={skippedCount}
                  backgroundColor={backgroundColor}
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
    backgroundColor: colors.primary,
    shadowColor: '#555555',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
  },
  excludedIndicator: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  excludedIndicatorText: {
    ...uppercase,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
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
