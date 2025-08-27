import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { subheading } from '@/utils/text';

export const AuthorizationOverlay = ({
  authorizationStatus,
  requestAuthorization,
}: {
  authorizationStatus: AuthorizationRequestStatus | null;
  requestAuthorization: () => Promise<AuthorizationRequestStatus>;
}) => {
  if (authorizationStatus === AuthorizationRequestStatus.unnecessary) {
    return null;
  }

  console.log('Rendering AuthorizationOverlay');

  return (
    <View style={styles.authorizationOverlay}>
      <View style={styles.authorizationCard}>
        <Text style={styles.authorizationTitle}>Authorization Required</Text>
        <Text style={styles.authorizationText}>
          To access your workout data, please grant permission in the Health app.
        </Text>
        <Button
          mode="contained"
          onPress={requestAuthorization}
          style={styles.authorizationButton}
          labelStyle={{
            color: '#fff',
            ...subheading,
            marginTop: 0,
            marginBottom: 0,
            paddingVertical: 10,
          }}
        >
          Grant Permission
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authorizationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 200,
  },
  authorizationCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authorizationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral,
    marginBottom: 15,
    textAlign: 'center',
  },
  authorizationText: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  authorizationButton: {
    paddingHorizontal: 30,
    backgroundColor: colors.primary,
    color: '#fff',
  },
});
