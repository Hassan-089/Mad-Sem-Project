import React, { useState } from 'react';
import { View, Button, Platform, Alert, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../utils/supabase'; // adjust path

export default function EditMosqueScreen({ route, navigation }) {
  const { mosque } = route.params;

  const [form, setForm] = useState({
    ...mosque,
    Fajar: new Date(`1970-01-01T${mosque.Fajar}`),
    Zuhr: new Date(`1970-01-01T${mosque.Zuhr}`),
    Asar: new Date(`1970-01-01T${mosque.Asar}`),
    Magribh: new Date(`1970-01-01T${mosque.Magribh}`),
    Isha: new Date(`1970-01-01T${mosque.Isha}`),
  });

  const [pickerState, setPickerState] = useState({ show: false, field: null });

  const showPicker = (field) => {
    setPickerState({ show: true, field });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setForm({ ...form, [pickerState.field]: selectedTime });
    }
    setPickerState({ show: false, field: null });
  };

  const formatTimeForSupabase = (dateObj) => {
    if (!dateObj) return null;
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}:00+05:00`;
  };

  const displayTime = (dateObj) => {
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('masjidList')
      .update({
        Masjid_Name: form.Masjid_Name,
        Masjid_Address: form.Masjid_Address,
        Fajar: formatTimeForSupabase(form.Fajar),
        Zuhr: formatTimeForSupabase(form.Zuhr),
        Asar: formatTimeForSupabase(form.Asar),
        Magribh: formatTimeForSupabase(form.Magribh),
        Isha: formatTimeForSupabase(form.Isha),
      })
      .eq('id', form.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Updated', 'Prayer times updated successfully');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {['Fajar', 'Zuhr', 'Asar', 'Magribh', 'Isha'].map((prayer) => (
        <View key={prayer} style={styles.timeRow}>
          <Text style={styles.label}>{prayer}</Text>
          <Button title={displayTime(form[prayer])} onPress={() => showPicker(prayer)} />
        </View>
      ))}

      <Button title="Update Masjid" onPress={handleUpdate} />

      {pickerState.show && (
        <DateTimePicker
          mode="time"
          value={form[pickerState.field]}
          onChange={handleTimeChange}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 20 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16 },
});
