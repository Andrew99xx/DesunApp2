import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, } from 'react-native';

const DynamicForm = ({ config }) => {
    const renderField = (field) => {
        switch (field.type) {
            case 'text':
            case 'password':
            case 'email':
            case 'number':
                return (
                    <View key={field.name} style={styles.fieldContainer}>
                        <Text style={styles.label}>{field.label}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={field.type === 'password'}
                            keyboardType={field.type === 'email' ? 'email-address' : field.type === 'number' ? 'numeric' : 'default'}
                            placeholder={field.label}
                        />
                    </View>
                );
                case 'checkbox':
                    return (
                      <View key={field.name} style={styles.fieldContainer}>
                        <Text style={styles.label}>{field.label}</Text>
                        {field.options.map((option) => (
                          <View key={option.value} style={styles.checkboxContainer}>
                            <CheckBox
                              value={option.checked}
                              onValueChange={(newValue) => {
                                option.checked = newValue;
                              }}
                            />
                            <Text style={styles.checkboxLabel}>{option.label}</Text>
                          </View>
                        ))}
                      </View>
                    );
                  case 'radio':
                    return (
                      <View key={field.name} style={styles.fieldContainer}>
                        <Text style={styles.label}>{field.label}</Text>
                        {field.options.map((option) => (
                          <View key={option.value} style={styles.radioContainer}>
                            <CheckBox
                              value={option.checked}
                              onValueChange={(newValue) => {
                                field.options.forEach(opt => opt.checked = false);
                                option.checked = newValue;
                              }}
                            />
                            <Text style={styles.radioLabel}>{option.label}</Text>
                          </View>
                        ))}
                      </View>
                    );
            case 'select':
                return (
                    <View key={field.name} style={styles.fieldContainer}>
                        <Text style={styles.label}>{field.label}</Text>
                        <Picker style={styles.picker}>
                            {field.options.map((option) => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.formContainer}>
            {config.fields.map((field) => renderField(field))}
            <Button title="Submit" onPress={() => { /* handle form submission */ }} />
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioLabel: {
        marginLeft: 8,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

export default DynamicForm;
