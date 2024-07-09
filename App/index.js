// Filename: index.js
// Combined code from all files

import React from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    const [translateResult, setTranslateResult] = useState('');
    const [inputWord, setInputWord] = useState('');

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

    const translateWord = async (word) => {
        setLoading(true);
        try {
            const response = await axios.post(ChatGPT_API_URL, {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant. Translate the given word.'
                    },
                    {
                        role: 'user',
                        content: `Translate the word "${word}" to ${selectedLanguage.label}.`
                    }
                ],
                model: 'gpt-4o'
            });

            const translatedWord = response.data.response.trim();
            setTranslateResult(translatedWord);
        } catch (error) {
            setTranslateResult('Error translating word.');
        } finally {
            setLoading(false);
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
                        <TouchableOpacity style={styles.button} onPress={() => speakWord(words[currentIndex])}>
                            <Text style={styles.buttonText}>Listen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleNextWord}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            <TextInput
                style={styles.input}
                placeholder="Enter a word to translate"
                placeholderTextColor="#999999"
                value={inputWord}
                onChangeText={setInputWord}
            />
            <TouchableOpacity style={styles.button} onPress={() => translateWord(inputWord)}>
                <Text style={styles.buttonText}>Translate</Text>
            </TouchableOpacity>
            {loading ? <ActivityIndicator size="large" color="#0000ff" /> :
                translateResult && (
                    <View style={styles.translationContainer}>
                        <Text style={styles.translationResult}>{translateResult}</Text>
                    </View>
                )
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: 20,
        padding: 20,
    },
    instruction: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    picker: {
        width: '100%',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    wordContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    word: {
        fontSize: 24,
        marginBottom: 20,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#000000',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
        color: '#000000',
    },
    translationContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    translationResult: {
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF',
    },
});

export default function App() {
    return (
        <LinearGradient
            colors={['#8A2BE2', '#FF00FF']}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Language Learning App</Text>
                <LanguageLearning />
            </SafeAreaView>
        </LinearGradient>
    );
}