// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, Button, View, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as Speech from 'expo-speech';

const ChatGPT_API_URL = 'http://apihub.p.appply.xyz:3300/chatgpt';
const languages = [
    { label: 'Spanish', code: 'es' },
    { label: 'French', code: 'fr' },
    { label: 'German', code: 'de' },
    { label: 'Chinese', code: 'zh' },
    { label: 'Japanese', code: 'ja' },
];

function LanguageLearning() {
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchBasicWords = async (language) => {
        setLoading(true);
        setWords([]);
        setCurrentIndex(0);

        try {
            const response = await axios.post(ChatGPT_API_URL, {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant for language learning. Provide a list of basic words in the selected language.'
                    },
                    {
                        role: 'user',
                        content: `Give me a list of 10 basic words in ${language.label}.`
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

    const handleLanguageChange = (itemValue, itemIndex) => {
        const selected = languages[itemIndex];
        setSelectedLanguage(selected);
        fetchBasicWords(selected);
    };

    const speakWord = (word) => {
        Speech.speak(word, { language: selectedLanguage.code });
    };

    const handleNextWord = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.instruction}>Select a language to learn basic words:</Text>
            <Picker
                selectedValue={selectedLanguage.label}
                style={styles.picker}
                onValueChange={handleLanguageChange}
            >
                {languages.map((language) => (
                    <Picker.Item key={language.code} label={language.label} value={language.label} />
                ))}
            </Picker>
            {loading ? <ActivityIndicator size="large" color="#0000ff" /> :
                words.length > 0 && (
                    <View style={styles.wordContainer}>
                        <Text style={styles.word}>{words[currentIndex]}</Text>
                        <Button title="Listen" onPress={() => speakWord(words[currentIndex])} />
                        <Button title="Next" onPress={handleNextWord} />
                    </View>
                )
            }
        </ScrollView>
    );
}

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Language Learning App</Text>
            <LanguageLearning />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        padding: 20,
        backgroundColor: '#FFFFFF',
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
    wordContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    word: {
        fontSize: 24,
        marginBottom: 10,
    },
});