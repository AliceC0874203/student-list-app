import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddStudent = ({ navigation }) => {
    const [studentId, setStudentId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [major, setMajor] = useState('');
    const [gpa, setGpa] = useState('');

    const validateAndSaveStudent = async () => {
        // Validate major format and GPA
        const majorPattern = /^[A-Za-z]\d{3}$/;
        const gpaPattern = /^\d{1,}(\.\d{1,2})?$/;

        if (!majorPattern.test(major)) {
            Alert.alert('Validation', 'Major should be in the format of a letter followed by three numbers (e.g., C101).');
            return;
        }

        if (!gpaPattern.test(gpa)) {
            Alert.alert('Validation', 'GPA should be a valid number (optionally with two decimal places).');
            return;
        }

        // Save the new student
        const newStudent = { id: studentId, firstName, lastName, major, gpa: parseFloat(gpa) };
        try {
            const existingStudents = JSON.parse(await AsyncStorage.getItem('students')) || [];
            const updatedStudents = [...existingStudents, newStudent];
            await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
            navigation.goBack(); // Navigate back to the student list
        } catch (error) {
            Alert.alert('Error', 'There was an error saving the student. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.inputContainer}>
                    <Icon name="id-card" size={20} color="#6f6f6f" />
                    <TextInput
                        placeholder="Student ID"
                        style={styles.input}
                        value={studentId}
                        onChangeText={setStudentId}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#6f6f6f" />
                    <TextInput
                        placeholder="First Name"
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#6f6f6f" />
                    <TextInput
                        placeholder="Last Name"
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="book" size={20} color="#6f6f6f" />
                    <TextInput
                        placeholder="Major"
                        style={styles.input}
                        value={major}
                        onChangeText={setMajor}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="graduation-cap" size={20} color="#6f6f6f" />
                    <TextInput
                        placeholder="GPA"
                        style={styles.input}
                        value={gpa}
                        onChangeText={setGpa}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={validateAndSaveStudent}>
                    <Text style={styles.buttonText}>Add Student</Text>
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

export default AddStudent;