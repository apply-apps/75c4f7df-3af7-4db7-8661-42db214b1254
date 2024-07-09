// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, Button, TextInput, View, ScrollView } from 'react-native';
import axios from 'axios';

const ChatGPT_API_URL = 'http://apihub.p.appply.xyz:3300/chatgpt';

function LanguageLearning() {
    const [inputText, setInputText] = useState('');
    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        setLoading(true);
        setResponseText('');
        
        try {
            const response = await axios.post(ChatGPT_API_URL, {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant for language learning. Please provide answers to help users learn new languages.'
                    },
                    {
                        role: 'user',
                        content: inputText
                    }
                ],
                model: 'gpt-4o'
            });

            setResponseText(response.data.response);
        } catch (error) {
            setResponseText('Error fetching response.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={stylesLearning.container}>
            <Text style={stylesLearning.instruction}>Enter a sentence you need help translating or understanding:</Text>
            <TextInput
                style={stylesLearning.input}
                placeholder="Type your sentence here..."
                value={inputText}
                onChangeText={setInputText}
            />
            <Button title="Ask ChatGPT" onPress={sendMessage} disabled={!inputText || loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {responseText ? <Text style={stylesLearning.response}>{responseText}</Text> : null}
        </ScrollView>
    );
}

const stylesLearning = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    instruction: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '100%',
    },
    response: {
        marginTop: 20,
        fontSize: 16,
        color: 'black',
    },
});

export default function App() {
    return (
        <SafeAreaView style={stylesApp.container}>
            <Text style={stylesApp.title}>Language Learning App</Text>
            <LanguageLearning />
        </SafeAreaView>
    );
}

const stylesApp = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});