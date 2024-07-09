// Filename: index.js
// Combined code from all files
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, Button, TextInput, View, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ChatGPT_API_URL = 'http://apihub.p.appply.xyz:3300/chatgpt';

function LanguageLearning() {
    const [inputText, setInputText] = useState('');
    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);

    const sendMessage = async (text) => {
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
                        content: text
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

    const handleTextTranslate = async () => {
        await sendMessage(inputText);
    };

    const handlePhotoTranslate = async () => {
        if (!photo) return;
        setLoading(true);
        setResponseText('');

        try {
            const ocrText = "Example text from OCR";            
            await sendMessage(ocrText);
        } catch (error) {
            setResponseText('Error fetching response.');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.instruction}>Enter a sentence you need help translating or understanding:</Text>
            <TextInput
                style={styles.input}
                placeholder="Type your sentence here..."
                value={inputText}
                onChangeText={setInputText}
            />
            <Button title="Ask ChatGPT" onPress={handleTextTranslate} disabled={!inputText || loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {responseText ? <Text style={styles.response}>{responseText}</Text> : null}

            <View style={styles.photoSection}>
                <Button title="Pick an Image" onPress={pickImage} />
                <Button title="Take a Photo" onPress={takePhoto} />
            </View>
            {photo && (
                <View style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <Button title="Translate Photo Text" onPress={handlePhotoTranslate} disabled={loading} />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
    photoSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    photoContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    photo: {
        width: 200,
        height: 200,
        marginBottom: 10,
        resizeMode: 'contain',
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
        marginTop: 20,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});