// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, Button, FlatList, ScrollView, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const ChatGPT_API_URL = 'http://apihub.p.appply.xyz:3300/chatgpt';
const languages = ['Spanish', 'French', 'German', 'Chinese', 'Japanese'];

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Language Learning App</Text>
            <LanguageLearning />
        </SafeAreaView>
    );
}

function LanguageLearning() {
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBasicWords = async (language) => {
        setLoading(true);
        setWords([]);

        try {
            const response = await axios.post(ChatGPT_API_URL, {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant for language learning. Provide a list of basic words in the selected language.'
                    },
                    {
                        role: 'user',
                        content: `Give me a list of 10 basic words in ${language}.`
                    }
                ],
                model: 'gpt-4o'
            });

            const wordList = response.data.response.split('\n').map((word) => word.trim()).filter((word) => word !== '');
            setWords(wordList);
        } catch (error) {
            setWords(['Error fetching words.']);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (itemValue) => {
        setSelectedLanguage(itemValue);
        fetchBasicWords(itemValue);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.instruction}>Select a language to learn basic words:</Text>
            <Picker
                selectedValue={selectedLanguage}
                style={styles.picker}
                onValueChange={handleLanguageChange}
            >
                {languages.map((language) => (
                    <Picker.Item key={language} label={language} value={language} />
                ))}
            </Picker>
            {loading ? <ActivityIndicator size="large" color="#0000ff" /> :
                <FlatList
                    data={words}
                    renderItem={({ item }) => <Text style={styles.word}>{item}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        padding: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    instruction: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: 200,
        marginBottom: 20,
    },
    word: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
});