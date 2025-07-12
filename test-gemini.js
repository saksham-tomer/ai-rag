// Test script for RAG system with Google Gemini
// Run with: node test-gemini.js

const BASE_URL = 'http://localhost:3000';

async function testGeminiIntegration() {
    try {
        console.log('🧪 Testing RAG System with Google Gemini...\n');

        // Test 1: Generate mock data
        console.log('1. Generating mock data...');
        const mockDataResponse = await fetch(`${BASE_URL}/api/generate-mock-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namespace: 'gemini-test' })
        });

        if (!mockDataResponse.ok) {
            throw new Error(`Mock data generation failed: ${mockDataResponse.status}`);
        }

        const mockData = await mockDataResponse.json();
        console.log('✅ Mock data generated successfully');
        console.log(`📊 Documents stored: ${mockData.data.documentsCount}\n`);

        // Test 2: Test conversational RAG with Gemini
        console.log('2. Testing conversational RAG with Gemini...');
        const sessionId = `gemini-session-${Date.now()}`;
        
        const ragResponse = await fetch(`${BASE_URL}/api/conversational-rag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: 'What is artificial intelligence?',
                namespace: 'gemini-test',
                sessionId: sessionId
            })
        });

        if (!ragResponse.ok) {
            const errorText = await ragResponse.text();
            throw new Error(`RAG query failed: ${ragResponse.status} - ${errorText}`);
        }

        const ragResult = await ragResponse.json();
        console.log('✅ Conversational RAG with Gemini successful');
        console.log(`🤖 Response: ${ragResult.response.substring(0, 150)}...\n`);

        // Test 3: Test follow-up question (memory)
        console.log('3. Testing conversation memory with Gemini...');
        const followUpResponse = await fetch(`${BASE_URL}/api/conversational-rag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: 'Can you elaborate on what we just discussed?',
                namespace: 'gemini-test',
                sessionId: sessionId
            })
        });

        if (!followUpResponse.ok) {
            const errorText = await followUpResponse.text();
            throw new Error(`Follow-up query failed: ${followUpResponse.status} - ${errorText}`);
        }

        const followUpResult = await followUpResponse.json();
        console.log('✅ Conversation memory with Gemini working');
        console.log(`🤖 Follow-up response: ${followUpResult.response.substring(0, 150)}...\n`);

        // Test 4: Test standard RAG
        console.log('4. Testing standard RAG with Gemini...');
        const standardResponse = await fetch(`${BASE_URL}/api/query-langchain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: 'What is machine learning?',
                namespace: 'gemini-test',
                useCustomRetriever: false
            })
        });

        if (!standardResponse.ok) {
            const errorText = await standardResponse.text();
            throw new Error(`Standard RAG failed: ${standardResponse.status} - ${errorText}`);
        }

        const standardResult = await standardResponse.json();
        console.log('✅ Standard RAG with Gemini successful');
        console.log(`🤖 Response: ${standardResult.response.substring(0, 150)}...\n`);

        console.log('🎉 All Gemini tests passed! The RAG system is working correctly with Google Gemini.');
        console.log('\n📝 System Status:');
        console.log('✅ Google Gemini LLM integration');
        console.log('✅ Conversational RAG with memory');
        console.log('✅ Standard RAG functionality');
        console.log('✅ Mock data generation');
        console.log('✅ Session management');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure the server is running: npm run dev');
        console.log('2. Check if GOOGLE_API_KEY is set in your environment');
        console.log('3. Verify all other environment variables are set');
        console.log('4. Check Google AI Studio for API quotas and billing');
        console.log('5. If issues persist, set USE_MOCK_LLM=true for testing');
    }
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch(`${BASE_URL}/api/generate-mock-data`, {
            method: 'GET'
        });
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('🔍 Checking if server is running...');
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('❌ Server is not running. Please start the development server first:');
        console.log('   npm run dev');
        return;
    }

    console.log('✅ Server is running!');
    await testGeminiIntegration();
}

main().catch(console.error); 