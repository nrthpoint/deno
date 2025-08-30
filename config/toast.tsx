import { BaseToast, ErrorToast, InfoToast, ToastConfigParams } from 'react-native-toast-message';

import { colors } from './colors';
import { LatoFonts } from './fonts';

export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#4CAF50',
        borderLeftWidth: 7,
        backgroundColor: colors.surface,
        height: 70,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontFamily: LatoFonts.bold,
        color: colors.neutral,
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: LatoFonts.regular,
        color: colors.lightGray,
        fontWeight: '400',
      }}
      text2NumberOfLines={2}
    />
  ),
  info: (props: ToastConfigParams<any>) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: '#2196F3',
        borderLeftWidth: 7,
        backgroundColor: colors.surface,
        height: 70,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontFamily: LatoFonts.bold,
        color: colors.neutral,
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: LatoFonts.regular,
        color: colors.lightGray,
        fontWeight: '400',
      }}
      text2NumberOfLines={2}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#F44336',
        borderLeftWidth: 7,
        backgroundColor: colors.surface,
        height: 70,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontFamily: LatoFonts.bold,
        color: colors.neutral,
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: LatoFonts.regular,
        color: colors.lightGray,
        fontWeight: '400',
      }}
      text2NumberOfLines={2}
    />
  ),
};
