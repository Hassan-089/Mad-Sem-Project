// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocation = async () => {
    try {
      // Ask for location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location access in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Get current location with high accuracy
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      setLocation(loc.coords);

      // Try multiple reverse geocoding methods
      try {
        // First try: Expo's reverse geocoding
        let addr = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (addr && addr.length > 0) {
          // If we get a result, use it
          setAddress(addr[0]);
        } else {
          // If no result, try Google's Geocoding API
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.coords.latitude},${loc.coords.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            // Format Google's response to match our address structure
            const result = data.results[0];
            const formattedAddress = {
              name: result.formatted_address,
              street: result.address_components.find(comp => comp.types.includes('route'))?.long_name,
              city: result.address_components.find(comp => comp.types.includes('locality'))?.long_name,
              region: result.address_components.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name,
              postalCode: result.address_components.find(comp => comp.types.includes('postal_code'))?.long_name,
              country: result.address_components.find(comp => comp.types.includes('country'))?.long_name,
              formattedAddress: result.formatted_address
            };
            setAddress(formattedAddress);
          } else {
            Alert.alert('Error', 'Could not find address for this location.');
          }
        }
      } catch (geocodeError) {
        console.log('Geocoding error:', geocodeError);
        Alert.alert(
          'Error',
          'Failed to get address details. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert(
        'Error',
        'Failed to fetch location. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLocation();
  };

  const formatAddress = (addr) => {
    if (!addr) return 'Address not available';
    
    // If we have a formatted address from Google, use it directly
    if (addr.formattedAddress) {
      return addr.formattedAddress;
    }
    
    // Otherwise, use our custom formatting
    const parts = [
      addr.name,
      addr.street,
      addr.city,
      addr.region,
      addr.postalCode,
      addr.country
    ].filter(Boolean); // Remove empty/null/undefined values
    
    return parts.join(', ');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4CAF50']}
        />
      }
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Your Location Details</Text>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Coordinates</Text>
          {location && (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinateText}>
                Latitude: {location.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinateText}>
                Longitude: {location.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.addressText}>
            {formatAddress(address)}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Text style={styles.refreshButtonText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
  },
  coordinatesContainer: {
    marginTop: 5,
  },
  coordinateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
