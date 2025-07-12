// Simple test script for RAG endpoints
// Run with: node test-rag.js

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, data) {
    try {
        console.log(`\nTesting ${endpoint}...`);
        console.log('Request:', JSON.stringify(data, null, 2));
        
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error(`Error testing ${endpoint}:`, error.message);
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting RAG System Tests...\n');

    const testSessionId = `test-session-${Date.now()}`;
    const testNamespace = 'default';

    // Test 1: Standard RAG
    await testEndpoint('/api/query-langchain', {
        question: 'What is the main topic of the document?',
        namespace: testNamespace,
        useCustomRetriever: false
    });

    // Test 2: Custom RAG
    await testEndpoint('/api/query-langchain', {
        question: 'Can you summarize the key points?',
        namespace: testNamespace,
        useCustomRetriever: true
    });

    // Test 3: Conversational RAG (First message)
    await testEndpoint('/api/conversational-rag', {
        question: 'What is the main topic of the document?',
        namespace: testNamespace,
        sessionId: testSessionId
    });

    // Test 4: Conversational RAG (Follow-up message to test memory)
    await testEndpoint('/api/conversational-rag', {
        question: 'Can you elaborate on what we just discussed?',
        namespace: testNamespace,
        sessionId: testSessionId
    });

    // Test 5: Different session (should not have memory from previous session)
    await testEndpoint('/api/conversational-rag', {
        question: 'What is the main topic of the document?',
        namespace: testNamespace,
        sessionId: `different-session-${Date.now()}`
    });

    console.log('\n✅ All tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Visit http://localhost:3000/test for interactive testing');
    console.log('2. Visit http://localhost:3000/chat/123 for chat interface');
    console.log('3. Check the RAG_TESTING_GUIDE.md for detailed testing scenarios');
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch(`${BASE_URL}/api/query-langchain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'test', namespace: 'test' })
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
    await runTests();
}

main().catch(console.error); 