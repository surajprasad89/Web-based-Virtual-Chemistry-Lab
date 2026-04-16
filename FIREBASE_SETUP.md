# Firebase Firestore Setup Guide for PoornimaChem

This guide will help you set up Firebase Firestore for your PoornimaChem application.

## Prerequisites

1. A Google account
2. A Firebase project (free tier is available)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "poornimachem")
4. Follow the setup wizard:
   - Disable Google Analytics (optional, you can enable it later)
   - Click **"Create project"**
5. Wait for the project to be created, then click **"Continue"**

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) or **"Add app"** → **"Web"**
2. Register your app:
   - Enter an app nickname (e.g., "PoornimaChem Web")
   - Check **"Also set up Firebase Hosting"** if you plan to use hosting (optional)
   - Click **"Register app"**
3. **Copy the Firebase configuration object** that appears on the screen

## Step 3: Configure Firestore Database

1. In the Firebase Console sidebar, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development) or **"Start in production mode"** (for production)
4. Select your preferred location (choose the closest to your users)
5. Click **"Enable"**

### Important: Set up Security Rules

After creating the database, you should set up security rules:

1. Go to **"Firestore Database"** → **"Rules"** tab
2. For testing/development, you can use:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2026, 1, 1);
       }
     }
   }
   ```
   ⚠️ **Note**: This rule allows all reads/writes until 2026. For production, you should implement proper security rules.

3. Click **"Publish"**

## Step 4: Update Firebase Configuration

1. Open `Frontend/firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

You can find these values in:
- Firebase Console → Project Settings → General → Your apps → Config

## Step 5: Test Your Setup

You can test if Firebase is properly connected by adding this to your `script.js` or creating a test:

```javascript
// Test Firebase connection
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Test: Add a test document
        await addDocument('test', {
            message: 'Firebase is working!',
            timestamp: new Date()
        });
        console.log('✅ Firebase Firestore is connected and working!');
        
        // Test: Get the document
        const docs = await getAllDocuments('test');
        console.log('Test documents:', docs);
    } catch (error) {
        console.error('❌ Firebase setup error:', error);
    }
});
```

## Usage Examples

### Adding Data

```javascript
// Add an experiment
const experimentId = await addExperiment(
    'Hardness of Water by EDTA Method',
    'This experiment measures water hardness...',
    { category: 'Water Analysis', difficulty: 'Intermediate' }
);

// Add a quiz question
const questionId = await addQuizQuestion(
    'What is the formula for water?',
    ['H2O', 'CO2', 'NaCl', 'O2'],
    0
);
```

### Reading Data

```javascript
// Get all experiments
const experiments = await getAllExperiments();
experiments.forEach(exp => {
    console.log(exp.title, exp.description);
});

// Get a specific experiment
const experiment = await getDocument('experiments', 'experiment-id-here');
```

### Real-time Updates

```javascript
// Listen to changes in experiments collection
const unsubscribe = listenToCollection('experiments', (experiments) => {
    console.log('Experiments updated:', experiments);
    // Update your UI here
});

// Later, when you want to stop listening:
// unsubscribe();
```

## Common Collections for PoornimaChem

Based on your application, you might want to create these collections:

1. **experiments** - Store lab experiment data
2. **quizQuestions** - Store quiz questions
3. **users** - Store user data (if you add authentication)
4. **resources** - Store tutorials, books, etc.
5. **labResults** - Store student lab results (if applicable)

## Security Rules (Production)

For production, update your Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, authenticated write for experiments
    match /experiments/{experimentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Authenticated read/write for quiz questions
    match /quizQuestions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // User can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

1. **"Firebase is not defined"** error:
   - Make sure Firebase scripts are loaded before `firebase-config.js`
   - Check browser console for script loading errors

2. **Permission denied errors**:
   - Check your Firestore security rules
   - Make sure you're using the correct collection/document names

3. **Connection issues**:
   - Verify your Firebase config values are correct
   - Check if your Firebase project has Firestore enabled

## Next Steps

1. ✅ Firebase Firestore is now set up
2. Consider adding Firebase Authentication for user management
3. Set up proper security rules for production
4. Implement data fetching in your application

## Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore JavaScript SDK Reference](https://firebase.google.com/docs/reference/js/v8/firebase.firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
