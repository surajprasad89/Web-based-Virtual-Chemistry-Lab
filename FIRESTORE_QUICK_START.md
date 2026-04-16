# Firestore Quick Start Guide

Your Firebase is already configured! Here's how to start using it right away.

## 🚀 Quick Start

### 1. Open Your Website
Open `index.html` in your browser. Check the browser console (F12) to see:
- ✅ Firestore connection status
- 📚 Experiments being loaded
- Any errors (if present)

### 2. First Time Setup - Initialize Default Data

Open the browser console (F12) and run:

```javascript
// Initialize default experiments
await initializeDefaultExperiments()

// Save quiz questions to Firestore
await saveQuizQuestionsToFirestore()
```

This will populate your Firestore database with:
- 12 default experiments
- 12 quiz questions

### 3. Verify Data in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `poornimachemdata`
3. Go to **Firestore Database**
4. You should see collections: `experiments` and `quizQuestions`

## 📝 Common Operations

### Add a New Experiment

```javascript
await addNewExperiment(
    'Experiment Title',
    'Experiment Description',
    'Category Name'
)
```

### Get All Experiments

```javascript
const experiments = await getAllDocuments('experiments')
console.log(experiments)
```

### Get a Specific Experiment

```javascript
const experiment = await getDocument('experiments', 'experiment-id-here')
console.log(experiment)
```

### Search Experiments

```javascript
const results = await searchExperiments('water')
console.log(results)
```

### Update an Experiment

```javascript
await updateDocument('experiments', 'experiment-id', {
    description: 'Updated description',
    category: 'New Category'
})
```

### Delete an Experiment

```javascript
await deleteDocument('experiments', 'experiment-id')
```

## 🎯 Integration Examples

### Example 1: Load Experiments Dynamically

The `db-examples.js` file already includes code that:
- Automatically loads experiments from Firestore on page load
- Updates the sidebar with Firestore data
- Falls back to default experiments if Firestore is empty

### Example 2: Use Firestore in Quiz

To load quiz questions from Firestore in `quiz.js`, you can modify it:

```javascript
// At the top of quiz.js, add:
let quizData = []; // Start with empty array

// Replace the hardcoded quizData with:
document.addEventListener('DOMContentLoaded', async () => {
    const firestoreQuestions = await loadQuizQuestionsFromFirestore();
    
    if (firestoreQuestions && firestoreQuestions.length > 0) {
        quizData = firestoreQuestions;
    } else {
        // Use default questions
        quizData = [/* your default questions */];
    }
    
    loadQuestion(); // Start the quiz
});
```

### Example 3: Add Search Functionality

Connect the search box to Firestore:

```javascript
// In script.js or a new file
document.querySelector('.search-box button').addEventListener('click', async () => {
    const searchTerm = document.querySelector('.search-box input').value;
    const results = await searchExperiments(searchTerm);
    
    // Display results
    console.log('Search results:', results);
    // Update UI with results...
});
```

### Example 4: Real-time Updates

Listen to changes in experiments:

```javascript
// This will update whenever experiments change
const unsubscribe = listenToCollection('experiments', (experiments) => {
    console.log('Experiments updated:', experiments);
    updateExperimentsSidebar(experiments);
});

// To stop listening later:
// unsubscribe();
```

## 🔧 Available Functions

All these functions are available globally (from `firestore.js` and `db-examples.js`):

### Basic CRUD Operations
- `addDocument(collection, data)` - Add a document
- `getDocument(collection, id)` - Get a document by ID
- `getAllDocuments(collection)` - Get all documents
- `updateDocument(collection, id, data)` - Update a document
- `deleteDocument(collection, id)` - Delete a document
- `queryDocuments(collection, field, operator, value)` - Query documents

### App-Specific Functions
- `addExperiment(title, description, additionalData)` - Add an experiment
- `getAllExperiments()` - Get all experiments
- `addQuizQuestion(question, options, correctAnswer)` - Add quiz question
- `getAllQuizQuestions()` - Get all quiz questions
- `addNewExperiment(title, description, category)` - Add experiment (with UI feedback)
- `searchExperiments(searchTerm)` - Search experiments
- `loadQuizQuestionsFromFirestore()` - Load quiz questions
- `saveQuizQuestionsToFirestore()` - Save default quiz questions

### Real-time Listeners
- `listenToDocument(collection, id, callback)` - Listen to a document
- `listenToCollection(collection, callback)` - Listen to a collection

## 🎨 UI Integration

The code automatically:
- ✅ Shows connection status notifications
- ✅ Loads experiments on page load
- ✅ Updates sidebar with Firestore data
- ✅ Handles errors gracefully

## 📊 Database Structure

Your Firestore will have this structure:

```
poornimachemdata/
├── experiments/
│   ├── {experiment-id}/
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── category: string
│   │   └── createdAt: timestamp
│   └── ...
├── quizQuestions/
│   ├── {question-id}/
│   │   ├── question: string
│   │   ├── options: array
│   │   ├── correctAnswer: number
│   │   └── createdAt: timestamp
│   └── ...
└── test/ (temporary test collection)
```

## 🐛 Troubleshooting

### "Firebase is not defined" error
- Make sure Firebase scripts load before `firebase-config.js`
- Check the script order in `index.html`

### "Permission denied" error
- Go to Firebase Console → Firestore Database → Rules
- For testing, use these rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
⚠️ **Warning**: This allows anyone to read/write. Only use for development!

### No data showing
- Check if collections exist in Firestore Console
- Run `initializeDefaultExperiments()` in console
- Check browser console for errors

## 📚 Next Steps

1. ✅ Initialize default data (run in console once)
2. ✅ Test basic operations (add, read, update)
3. ✅ Integrate with your UI
4. ✅ Set up proper security rules for production
5. ✅ Consider adding Firebase Authentication for user-specific data

## 💡 Tips

- Always use `await` when calling async functions
- Wrap Firestore calls in try-catch for error handling
- Use real-time listeners for live updates
- Check browser console for helpful logs

Happy coding! 🚀


