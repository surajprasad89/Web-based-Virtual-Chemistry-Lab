// Firestore Database Utility Functions
// This file provides helper functions for common Firestore operations

/**
 * Add a new document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {object} data - Data to add
 * @returns {Promise} - Promise that resolves with document ID
 */
async function addDocument(collectionName, data) {
    try {
        const docRef = await db.collection(collectionName).add(data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}

/**
 * Get a document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise} - Promise that resolves with document data
 */
async function getDocument(collectionName, docId) {
    try {
        const docRef = db.collection(collectionName).doc(docId);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        throw error;
    }
}

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise} - Promise that resolves with array of documents
 */
async function getAllDocuments(collectionName) {
    try {
        const querySnapshot = await db.collection(collectionName).get();
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw error;
    }
}

/**
 * Update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {object} data - Data to update
 * @returns {Promise} - Promise that resolves when update is complete
 */
async function updateDocument(collectionName, docId, data) {
    try {
        const docRef = db.collection(collectionName).doc(docId);
        await docRef.update(data);
        console.log("Document updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
}

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise} - Promise that resolves when delete is complete
 */
async function deleteDocument(collectionName, docId) {
    try {
        await db.collection(collectionName).doc(docId).delete();
        console.log("Document deleted successfully");
        return true;
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw error;
    }
}

/**
 * Query documents with a where clause
 * @param {string} collectionName - Name of the collection
 * @param {string} field - Field to query
 * @param {string} operator - Operator (==, <, >, <=, >=, etc.)
 * @param {any} value - Value to compare
 * @returns {Promise} - Promise that resolves with array of matching documents
 */
async function queryDocuments(collectionName, field, operator, value) {
    try {
        const querySnapshot = await db.collection(collectionName)
            .where(field, operator, value)
            .get();
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        console.error("Error querying documents: ", error);
        throw error;
    }
}

/**
 * Set a document (creates if doesn't exist, replaces if exists)
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {object} data - Data to set
 * @returns {Promise} - Promise that resolves when set is complete
 */
async function setDocument(collectionName, docId, data) {
    try {
        await db.collection(collectionName).doc(docId).set(data);
        console.log("Document set successfully");
        return true;
    } catch (error) {
        console.error("Error setting document: ", error);
        throw error;
    }
}

/**
 * Real-time listener for a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {function} callback - Callback function that receives document data
 * @returns {function} - Unsubscribe function
 */
function listenToDocument(collectionName, docId, callback) {
    return db.collection(collectionName).doc(docId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                callback({ id: doc.id, ...doc.data() });
            } else {
                callback(null);
            }
        });
}

/**
 * Real-time listener for a collection
 * @param {string} collectionName - Name of the collection
 * @param {function} callback - Callback function that receives array of documents
 * @returns {function} - Unsubscribe function
 */
function listenToCollection(collectionName, callback) {
    return db.collection(collectionName)
        .onSnapshot((querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            callback(documents);
        });
}

// Example usage functions for PoornimaChem app

/**
 * Add an experiment to the database
 * @param {string} title - Experiment title
 * @param {string} description - Experiment description
 * @param {object} additionalData - Any additional experiment data
 */
async function addExperiment(title, description, additionalData = {}) {
    const experimentData = {
        title: title,
        description: description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...additionalData
    };
    return await addDocument('experiments', experimentData);
}

/**
 * Get all experiments
 */
async function getAllExperiments() {
    return await getAllDocuments('experiments');
}

/**
 * Add a quiz question
 * @param {string} question - Question text
 * @param {array} options - Array of answer options
 * @param {number} correctAnswer - Index of correct answer
 */
async function addQuizQuestion(question, options, correctAnswer) {
    const questionData = {
        question: question,
        options: options,
        correctAnswer: correctAnswer,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    return await addDocument('quizQuestions', questionData);
}

/**
 * Get all quiz questions
 */
async function getAllQuizQuestions() {
    return await getAllDocuments('quizQuestions');
}
