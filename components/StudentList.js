import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { SearchBar, Button, Card, ListItem } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const StudentList = ({ navigation }) => {
  const [fullStudentsList, setFullStudentsList] = useState([]); // State to hold the full list
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState(null); // 'asc' for A-Z, 'desc' for Z-A, 'gpa' for GPA

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStudents();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const loadStudents = async () => {
    let studentsData = await AsyncStorage.getItem('students');
    if (studentsData !== null) {
      studentsData = JSON.parse(studentsData);
      setFullStudentsList(studentsData); // Set the full list
      applyFiltersAndSort(studentsData); // Apply any active filters/sort
    }
  };

  const applyFiltersAndSort = (data) => {
    let filteredData = applySearchFilter(data, searchQuery);
    let sortedData = applySort(filteredData, sortDirection);
    setStudents(sortedData); // Set the display list
  };

  const applySort = (data, direction) => {
    let sortedData = [...data]; // Create a new array to prevent mutating the original data
    sortedData.sort((a, b) => {
      switch (direction) {
        case 'asc':
          return a.lastName.localeCompare(b.lastName);
        case 'desc':
          return b.lastName.localeCompare(a.lastName);
        case 'gpa-asc': // Handle GPA ascending sort
          return a.gpa - b.gpa;
        case 'gpa-desc': // Handle GPA descending sort
          return b.gpa - a.gpa;
        default:
          return 0; // No sorting
      }
    });
    return sortedData;
  };

  const applySearchFilter = (data, query) => {
    if (query.trim() === '') return data;
    return data.filter((student) => {
      return (
        student.id.includes(query) ||
        student.major.toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  // This function now just updates the search query state
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const filteredData = applySearchFilter(fullStudentsList, query);
    const sortedData = applySort(filteredData, sortDirection);
    setStudents(sortedData);
  };

  // Call this function when sort options change
  const handleSortChange = (direction) => {
    setSortDirection(direction);
    const sortedStudents = applySort(fullStudentsList, direction); // Sort full list, not the filtered list
    setStudents(sortedStudents);
  };

  // Function to handle the GPA sort direction toggle
  const toggleGpaSortDirection = () => {
    let newDirection;
    if (sortDirection === 'gpa-asc') {
      newDirection = 'gpa-desc';
    } else if (sortDirection === 'gpa-desc') {
      newDirection = null; // or 'asc'/'desc' if you want to cycle through those as well
    } else {
      newDirection = 'gpa-asc';
    }
    handleSortChange(newDirection);
  };

  // Function that determines the title and icon for the GPA button
  const getGpaSortDetails = () => {
    switch (sortDirection) {
      case 'gpa-asc':
        return { title: 'GPA', icon: 'sort-down' }; // Icon for ascending sort
      case 'gpa-desc':
        return { title: 'GPA', icon: 'sort-up' }; // Icon for descending sort
      default:
        return { title: 'GPA', icon: 'sort' }; // Default state when no GPA sort is applied
    }
  };

  const deleteStudent = (id) => {
    // add check first to make sure user want to delete 
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this Student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const newStudents = students.filter(student => student.id !== id);
            AsyncStorage.setItem('students', JSON.stringify(newStudents));
            setStudents(newStudents);
          },
        },
      ]
    );
  };

  // Function to handle the sort direction toggle
  const toggleSortDirection = () => {
    handleSortChange(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Icon for the sort button based on current sort direction
  const sortIconName = sortDirection === 'asc' ? 'sort-down' : 'sort-up';

  const resetSort = () => {
    setSortDirection(null);
    setStudents(fullStudentsList); // Reset to full unsorted list
  };

  const renderStudent = ({ item }) => {
    const swipeButtons = [
      {
        text: 'Edit',
        backgroundColor: 'orange',
        onPress: () => {
          navigation.navigate('EditStudent', { studentId: item.id });
        }
      },
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => { deleteStudent(item.id) }
      },
    ];

    return (
      <Swipeout right={swipeButtons} autoClose backgroundColor="transparent">
        <TouchableOpacity onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}>
          <Card>
            <Card.Title>{`${item.firstName} ${item.lastName}`}</Card.Title>
            <Card.Divider />
            <Text>{`ID: ${item.id}`}</Text>
            <Text>{`Major: ${item.major}`}</Text>
            <Text>{`GPA: ${item.gpa.toFixed(2)}`}</Text>
          </Card>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search by ID or Major"
        onChangeText={handleSearchChange}
        value={searchQuery}
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      <View style={styles.sortButtonsContainer}>
        <Button
          title={sortDirection === 'asc' ? ' Last Name (A-Z)' : ' Last Name (A-Z)'}
          icon={<FontAwesome name={sortIconName} size={15} color="white" />}
          onPress={toggleSortDirection}
          buttonStyle={styles.sortButton}
        />
        <Button
          title={getGpaSortDetails().title}
          icon={<FontAwesome name={getGpaSortDetails().icon} size={15} color="white" />}
          onPress={toggleGpaSortDirection}
          buttonStyle={styles.sortButton}
        />
        <Button
          title="Reset Sort"
          onPress={resetSort}
          buttonStyle={styles.sortButton}
        />
      </View>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddStudent')}
      >
        <FontAwesome name="plus" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light grey background
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 90,
    backgroundColor: '#5848ff',
    borderRadius: 28,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#e9ecef', // Lighter grey for input
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});

export default StudentList;
