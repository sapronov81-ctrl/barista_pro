import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';
export const CoffeeHeader: React.FC = () => (
  <View style={styles.row}>
    <Image source={require('../../../assets/design/logo.png')} style={styles.logo} />
    <View style={{ flex: 1 }} />
    <Text style={styles.title}>Barista Pro</Text>
  </View>
);
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  logo: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#ddd' },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
});
