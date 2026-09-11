/**
 * ============================================
 * MAIN ENTRY POINT (index.js)
 * ============================================
 * 
 * This file is the starting point of your application.
 * It handles:
 * - Getting DOM elements
 * - Form validation
 * - Starting the quiz
 * - Loading/error states
 * 
 * DOM ELEMENTS TO GET:
 * - quizOptionsForm: #quizOptions
 * - playerNameInput: #playerName
 * - categoryInput: #categoryMenu
 * - difficultyOptions: #difficultyOptions
 * - questionsNumber: #questionsNumber
 * - startQuizBtn: #startQuiz
 * - questionsContainer: .questions-container
 * 
 * FUNCTIONS TO IMPLEMENT:
 * - showLoading() - Display loading spinner
 * - hideLoading() - Remove loading spinner
 * - showError(message) - Display error card
 * - validateForm() - Check if form is valid
 * - showFormError(message) - Show error on form
 * - resetToStart() - Reset to initial state
 * - startQuiz() - Main function to start quiz
 */



// ============================================
// TODO: Get DOM Element References
// ============================================
// Use document.getElementById() and document.querySelector()


// ============================================
// TODO: Create variable to store current quiz
// ============================================
// let currentQuiz = null;


// ============================================
// TODO: Create showLoading() function
// ============================================
// Set questionsContainer.innerHTML to loading HTML
// See index.html for the HTML structure


// ============================================
// TODO: Create hideLoading() function
// ============================================
// Find and remove the loading overlay


// ============================================
// TODO: Create showError(message) function
// ============================================
// Set questionsContainer.innerHTML to error HTML
// Include the message parameter in the display
// Add click listener to retry button that calls resetToStart()


// ============================================
// TODO: Create validateForm() function
// ============================================
// Return object: { isValid: boolean, error: string | null }
// Check:
// 1. questionsNumber has a value
// 2. Value is >= 1 (minimum questions)
// 3. Value is <= 50 (maximum questions)


// ============================================
// TODO: Create showFormError(message) function
// ============================================
// Create error div with class 'form-error'
// Insert before the start button
// Remove after 3 seconds with fade effect


// ============================================
// TODO: Create resetToStart() function
// ============================================
// 1. Clear questionsContainer
// 2. Reset form values
// 3. Show the form (remove 'hidden' class)
// 4. Set currentQuiz = null


// ============================================
// TODO: Create async startQuiz() function
// ============================================
// This is the main function, called when Start button is clicked
//
// Steps:
// 1. Validate the form
// 2. If not valid, show error and return
// 3. Get form values:
//    - playerName (use 'Player' if empty)
//    - category
//    - difficulty
//    - numberOfQuestions
// 4. Create new Quiz instance
// 5. Hide the form (add 'hidden' class)
// 6. Show loading spinner
// 7. Try to fetch questions:
//    - await currentQuiz.getQuestions()
//    - Hide loading
//    - Check if questions exist
//    - Create first Question and display it
// 8. Catch any errors:
//    - Hide loading
//    - Show error message


// ============================================
// TODO: Add Event Listeners
// ============================================
// 1. startQuizBtn click -> call startQuiz()
// 2. questionsNumber keydown -> if Enter, call startQuiz()

import Quiz from "./quiz.js";
import Question from "./question.js";

const quizOptionsForm = document.getElementById("quizOptions");
const playerNameInput = document.getElementById("playerName");
const categoryInput = document.getElementById("categoryMenu");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startQuizBtn = document.getElementById("startQuiz");
const questionsContainer = document.querySelector(".questions-container");
let currentQuiz = null;

function showLoading() {
  questionsContainer.innerHTML = `
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading Questions...</p>
    </div>
  `;
}

function showError(message) {
  questionsContainer.innerHTML = `
    <div class="game-card error-card">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="error-title">Oops! Something went wrong</h3>
      <p class="error-message">${message}</p>
      <button class="btn-play retry-btn">
        <i class="fa-solid fa-rotate-right"></i> Try Again
      </button>
    </div>
  `;

  const retryBtn = document.querySelector(".retry-btn");
  retryBtn.addEventListener("click", resetToStart);
}

function showFormError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("form-error");
  errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  startQuizBtn.insertAdjacentElement("beforebegin", errorDiv);
  setTimeout(() => {
    errorDiv.classList.add("fade-out");
    setTimeout(() => {
      errorDiv.remove();
    }, 500);
  }, 3000);
}

function hideLoading() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}

function validateForm() {
  const value = questionsNumber.value;
  if (!value) {
    return { isValid: false, error: "Please enter number of questions." };
  }
  const numValue = +(value);
  if (numValue < 1) {
    return { isValid: false, error: "You need at least 1 question." };
  }
  if (numValue > 50) {
    return { isValid: false, error: "Maximum 50 questions allowed." };
  }
  return { isValid: true, error: null };
}

function resetToStart() {
  questionsContainer.innerHTML = "";
  quizOptionsForm.reset();
  questionsNumber.value=""
  quizOptionsForm.classList.remove("hidden");
  currentQuiz = null;
}
async function startQuiz() {
  const validation = validateForm();
  if (!validation.isValid) {
    showFormError(validation.error);
    return;
  }
  const playerName = playerNameInput.value || "Player";
  const category = categoryInput.value;
  const difficulty = difficultyOptions.value;
  const numberOfQuestions = questionsNumber.value;
  currentQuiz = new Quiz(category, difficulty, numberOfQuestions, playerName);
  quizOptionsForm.classList.add("hidden");
  showLoading();
  try {
    await currentQuiz.getQuestions();
    hideLoading();
    if (currentQuiz.questions.length === 0) {
      showError("No questions found. Please try different options.");
      return;
    }
    const firstQuestion = new Question(currentQuiz, questionsContainer, resetToStart);
    firstQuestion.displayQuestion();
  } catch (error) {
    hideLoading();
    showError("Something went wrong while fetching questions. Please try again.");
  }
}

startQuizBtn.addEventListener("click", startQuiz);

questionsNumber.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startQuiz();
  }
});