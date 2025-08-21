import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

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
    backgroundColor: '#FFFFFF',
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
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  authorizationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  authorizationButton: {
    paddingHorizontal: 30,
  },
});
