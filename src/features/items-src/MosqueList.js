// masjidlis.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../utils/supabase';
import { useNavigation } from '@react-navigation/native';

export default function MosqueList() {
  const navigation = useNavigation();
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMosques();
  }, []);

  const fetchMosques = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('MasjidList')
        .select('*');
       console.log(data);
      

      if (error) {
        console.error('Error fetching mosques:', error.message);
        setError(error.message);
        return;
      }

      if (data) {
        setMosques(data);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mosques}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mosqueCard}>
            <Text style={styles.mosqueName}>{item.Masjid_Name}</Text>
            <Text style={styles.mosqueAddress}>{item.Masjid_Address}</Text>
         
              <View style={styles.prayerTimesContainer}>
                <Text style={styles.prayerTime}>Fajr: {item.Fajar}</Text>
                <Text style={styles.prayerTime}>Dhuhr: {item.Zuhr}</Text>
                <Text style={styles.prayerTime}>Asr: {item.Asar}</Text>
                <Text style={styles.prayerTime}>Maghrib: {item.Magribh}</Text>
                <Text style={styles.prayerTime}>Isha: {item.Isha}</Text>
              </View>
           
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No mosques found</Text>
        }
      />
       <TouchableOpacity 
          style={[styles.refreshButton, styles.masjidButton]}
          onPress={() => navigation.navigate('EditMasjid')}
        >
          <Text style={styles.refreshButtonText}>View Nearby Masjids</Text>
        </TouchableOpacity>
   
    </View>
     
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  mosqueCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  mosqueAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  masjidButton: {
    backgroundColor: '#2196F3',
    marginTop: 15,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  // prayerTimesContainer: {
  //   borderTopWidth: 1,
  //   borderTopColor: '#eee',
  //   paddingTop: 12,
  // },
  // prayerTime: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginBottom: 4,
  // },
  // errorText: {
  //   color: 'red',
  //   textAlign: 'center',
  //   marginTop: 20,
  // },
  // emptyText: {
  //   textAlign: 'center',
  //   marginTop: 20,
  //   color: '#666',
  // },
});
