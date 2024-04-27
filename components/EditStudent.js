import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditStudent = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState({
    id: '',
    firstName: '',
    lastName: '',
    major: '',
    gpa: '',
  });

  useEffect(() => {
    // Load the student's current data
    const loadStudentData = async () => {
      const studentsData = await AsyncStorage.getItem('students');
      if (studentsData !== null) {
        const students = JSON.parse(studentsData);
        const studentData = students.find(s => s.id === studentId);
        if (studentData) {
          setStudent(studentData);
        }
      }
    };

    loadStudentData();
  }, [studentId]);

  const handleSave = async () => {
    // Validate and save student data, then navigate back
    const studentsData = JSON.parse(await AsyncStorage.getItem('students'));
    const studentIndex = studentsData.findIndex((s) => s.id === student.id);
    studentsData[studentIndex] = student;
    await AsyncStorage.setItem('students', JSON.stringify(studentsData));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Icon name="id-card" size={20} color="#6f6f6f" />
          <TextInput
            placeholder="Student ID"
            style={styles.input}
            value={student.id} // Assuming student object has id, firstName, etc.
            onChangeText={(text) => setStudent({ ...student, id: text })}
            editable={false} // Student ID should not be editable
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#6f6f6f" />
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={student.firstName}
            onChangeText={(text) => setStudent({ ...student, firstName: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#6f6f6f" />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={student.lastName}
            onChangeText={(text) => setStudent({ ...student, lastName: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="book" size={20} color="#6f6f6f" />
          <TextInput
            placeholder="Major"
            style={styles.input}
            value={student.major}
            onChangeText={(text) => setStudent({ ...student, major: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="graduation-cap" size={20} color="#6f6f6f" />
          <TextInput
            placeholder="GPA"
            style={styles.input}
            value={student.gpa.toString()} // Convert GPA to string for the TextInput
            onChangeText={(text) => setStudent({ ...student, gpa: parseFloat(text) })}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );  
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    card: {
        width: '100%',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        marginBottom: 20,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3366ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditStudent;
