import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentDetail = ({ route, navigation }) => {
  const [students, setStudents] = useState([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  // Load the students from AsyncStorage
  useEffect(() => {
    const getStudents = async () => {
      const studentsData = await AsyncStorage.getItem('students');
      if (studentsData !== null) {
        const studentsArray = JSON.parse(studentsData);
        setStudents(studentsArray);
        // Find the index of the current student
        const index = studentsArray.findIndex((student) => student.id === route.params.studentId);
        setCurrentStudentIndex(index);
      }
    };

    getStudents();
  }, [route.params.studentId]);

  // Function to navigate to a specific student based on index
  const navigateToStudent = (index) => {
    if (index >= 0 && index < students.length) {
      setCurrentStudentIndex(index);
      navigation.setParams({ studentId: students[index].id });
    }
  };

  // Individual functions for the navigation buttons
  const goToFirstStudent = () => navigateToStudent(0);
  const goToPreviousStudent = () => navigateToStudent(currentStudentIndex - 1);
  const goToNextStudent = () => navigateToStudent(currentStudentIndex + 1);
  const goToLastStudent = () => navigateToStudent(students.length - 1);

  // Display the current student's details
  const currentStudent = students[currentStudentIndex];

  return (
    <View style={styles.container}>
      {currentStudent ? (
        <>
          <Text style={styles.detailText}>ID: {currentStudent.id}</Text>
          <Text style={styles.detailText}>First Name: {currentStudent.firstName}</Text>
          <Text style={styles.detailText}>Last Name: {currentStudent.lastName}</Text>
          <Text style={styles.detailText}>Major: {currentStudent.major}</Text>
          <Text style={styles.detailText}>GPA: {currentStudent.gpa}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={goToFirstStudent} style={styles.button}>
              <Text style={styles.buttonText}>First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToPreviousStudent} style={styles.button} disabled={currentStudentIndex === 0}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextStudent} style={styles.button} disabled={currentStudentIndex === students.length - 1}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToLastStudent} style={styles.button}>
              <Text style={styles.buttonText}>Last</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.detailText}>Student not found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StudentDetail;
