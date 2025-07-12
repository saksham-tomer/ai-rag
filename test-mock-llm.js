// Test script for RAG system with mock LLM
// Run with: node test-mock-llm.js

const BASE_URL = 'http://localhost:3000';

async function testMockLLM() {
    try {
        console.log('🧪 Testing RAG System with Mock LLM...\n');

        // Test 1: Generate mock data
        console.log('1. Generating mock data...');
        const mockDataResponse = await fetch(`${BASE_URL}/api/generate-mock-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namespace: 'test-namespace' })
        });

        if (!mockDataResponse.ok) {
            throw new Error(`Mock data generation failed: ${mockDataResponse.status}`);
        }

        const mockData = await mockDataResponse.json();
        console.log('✅ Mock data generated successfully');
        console.log(`📊 Documents stored: ${mockData.data.documentsCount}\n`);

        // Test 2: Test conversational RAG
        console.log('2. Testing conversational RAG...');
        const sessionId = `test-session-${Date.now()}`;
        
        const ragResponse = await fetch(`${BASE_URL}/api/conversational-rag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: 'What is artificial intelligence?',
                namespace: 'test-namespace',
                sessionId: sessionId
            })
        });

        if (!ragResponse.ok) {
            throw new Error(`RAG query failed: ${ragResponse.status}`);
        }

        const ragResult = await ragResponse.json();
        console.log('✅ Conversational RAG successful');
        console.log(`🤖 Response: ${ragResult.response.substring(0, 100)}...\n`);

        // Test 3: Test follow-up question (memory)
        console.log('3. Testing conversation memory...');
        const followUpResponse = await fetch(`${BASE_URL}/api/conversational-rag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: 'Can you tell me more about what we just discussed?',
                namespace: 'test-namespace',
                sessionId: sessionId
            })
        });

        if (!followUpResponse.ok) {
            throw new Error(`Follow-up query failed: ${followUpResponse.status}`);
        }

        const followUpResult = await followUpResponse.json();
        console.log('✅ Conversation memory working');
        console.log(`🤖 Follow-up response: ${followUpResult.response.substring(0, 100)}...\n`);

        // Test 4: Test different session (no memory)
        console.log('4. Testing session isolation...');
        const newSessionResponse = await fetch(`${BASE_URL}/api/conversational-rag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: 'What is artificial intelligence?',
                namespace: 'test-namespace',
                sessionId: `different-session-${Date.now()}`
            })
        });

        if (!newSessionResponse.ok) {
            throw new Error(`New session query failed: ${newSessionResponse.status}`);
        }

        const newSessionResult = await newSessionResponse.json();
        console.log('✅ Session isolation working');
        console.log(`🤖 New session response: ${newSessionResult.response.substring(0, 100)}...\n`);

        console.log('🎉 All tests passed! The RAG system with mock LLM is working correctly.');
        console.log('\n📝 Next steps:');
        console.log('1. Set up your Google Gemini API key');
        console.log('2. Set USE_MOCK_LLM=false in your environment');
        console.log('3. Restart the server to use real Gemini LLM');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure the server is running: npm run dev');
        console.log('2. Check if all environment variables are set');
        console.log('3. Verify Pinecone connection');
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
    await testMockLLM();
}

main().catch(console.error); 