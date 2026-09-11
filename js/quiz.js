/**
 * ============================================
 * QUIZ CLASS
 * ============================================
 * 
 * This class manages the entire quiz game state.
 * 
 * PROPERTIES TO CREATE:
 * - category (string) - The selected category ID
 * - difficulty (string) - easy, medium, or hard
 * - numberOfQuestions (number) - How many questions
 * - playerName (string) - The player's name
 * - score (number) - Current score, starts at 0
 * - questions (array) - Questions from API, starts empty
 * - currentQuestionIndex (number) - Which question we're on, starts at 0
 * 
 * METHODS TO IMPLEMENT:
 * - constructor(category, difficulty, numberOfQuestions, playerName)
 * - async getQuestions() - Fetch questions from API
 * - buildApiUrl() - Create the API URL with parameters
 * - incrementScore() - Add 1 to score
 * - getCurrentQuestion() - Get the current question object
 * - nextQuestion() - Move to next question, return true/false
 * - isComplete() - Check if quiz is finished
 * - getScorePercentage() - Calculate percentage (0-100)
 * - saveHighScore() - Save to localStorage
 * - getHighScores() - Load from localStorage
 * - isHighScore() - Check if current score qualifies
 * - endQuiz() - Generate results screen HTML
 * 
 */



  
  // TODO: Create constructor
  // Initialize all properties mentioned above
  
  
  // TODO: Create async getQuestions() method
  // 1. Build the API URL using buildApiUrl()
  // 2. Use fetch() to get data
  // 3. Check if response.ok, throw error if not
  // 4. Parse JSON: const data = await response.json()
  // 5. Check if data.response_code === 0 (success)
  // 6. Store data.results in this.questions
  // 7. Return this.questions
  
  
  // TODO: Create buildApiUrl() method
  // Use URLSearchParams to build query string
  // Example result: "https://opentdb.com/api.php?amount=10&difficulty=easy"
  
  
  // TODO: Create incrementScore() method
  // Simply add 1 to this.score
  
  
  // TODO: Create getCurrentQuestion() method
  // Return this.questions[this.currentQuestionIndex]
  // Return null if index is out of bounds
  
  
  // TODO: Create nextQuestion() method
  // Increment currentQuestionIndex
  // Return true if there are more questions
  // Return false if quiz is complete
  
  
  // TODO: Create isComplete() method
  // Return true if currentQuestionIndex >= questions.length
  
  
  // TODO: Create getScorePercentage() method
  // Calculate: (score / numberOfQuestions) * 100
  // Round to whole number using Math.round()
  
  
  // TODO: Create saveHighScore() method
  // 1. Get existing high scores using getHighScores()
  // 2. Create new score object: { name, score, total, percentage, difficulty, date }
  // 3. Push to array
  // 4. Sort by percentage (highest first)
  // 5. Keep only top 10
  // 6. Save to localStorage using JSON.stringify()
  
  
  // TODO: Create getHighScores() method
  // 1. Get from localStorage using 'quizHighScores' key
  // 2. Parse JSON
  // 3. Return array (or empty array if nothing saved)
  // Wrap in try/catch for safety
  
  
  // TODO: Create isHighScore() method
  // Return true if:
  // - Less than 10 saved, OR
  // - Current percentage beats the lowest saved score
  
  
  // TODO: Create endQuiz() method
  // 1. Calculate percentage
  // 2. Check if it's a high score
  // 3. If yes, save it (BEFORE getting high scores for display)
  // 4. Get high scores (AFTER saving)
  // 5. Return HTML string for results screen
  //    (See index.html for the HTML structure to use)
  

export default class Quiz {

   constructor(category, difficulty, numberOfQuestions, playerName){
    this.category=category
    this.difficulty=difficulty
    this.numberOfQuestions=numberOfQuestions
    this.playerName=playerName||"Player"
    this.score=0
    this.currentQuestionIndex=0
    this.questions=[]
  }
  
async getQuestions(){
  const response = await fetch(this.buildApiUrl())
  if (!response.ok) {
    throw new Error("Failed to fetch questions from the server.")
  }
  const data = await response.json()
  if (data.response_code !== 0) {
    throw new Error("No questions available for these settings.")
  }
  this.questions = data.results
  return this.questions
}

  buildApiUrl() {
  const params = new URLSearchParams({
    amount: this.numberOfQuestions,
    difficulty: this.difficulty,
  });

  if (this.category) {
    params.append("category", this.category);
  }

  return `https://opentdb.com/api.php?${params.toString()}`;
}
  incrementScore(){
    this.score+=1
  }

  getCurrentQuestion(){
      return this.questions[this.currentQuestionIndex] || null
  }

  nextQuestion(){
    this.currentQuestionIndex+=1
    if(this.currentQuestionIndex < this.questions.length){
      return true
    }else{
      return false
    }
  }

  isComplete(){
    if(this.currentQuestionIndex >= this.questions.length){
      return true
    }
    return false
  }

  getScorePercentage(){
    const percentage=Math.round((this.score / this.numberOfQuestions) * 100)
    return percentage
  }
  
saveHighScore() {
  const existingScores = this.getHighScores();
  const newScore = {
    name: this.playerName,
    score: this.score,
    total: this.numberOfQuestions,
    percentage: this.getScorePercentage(),
    difficulty: this.difficulty,
    date: new Date().toLocaleDateString()
  }
  existingScores.push(newScore)
  existingScores.sort((a, b) => b.percentage - a.percentage)
  const topScores = existingScores.slice(0, 10)
  localStorage.setItem("quizHighScores", JSON.stringify(topScores))
}
  
  getHighScores(){
  try {
    const scores = localStorage.getItem("quizHighScores");
    if (scores) {
      return JSON.parse(scores);
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

isHighScore(){
  const scores = this.getHighScores();
  if (scores.length < 10) {
    return true;
  }
  const lowestScore = scores[scores.length - 1];
  return this.getScorePercentage() > lowestScore.percentage;
}

endQuiz() {
  const percentage = this.getScorePercentage();
  const isNewHighScore = this.isHighScore();
  if (isNewHighScore) {
    this.saveHighScore();
  }
  const highScores = this.getHighScores();
  const medals = ["gold", "silver", "bronze"];
  const leaderboardItems = highScores.map((entry, i) => `
    <li class="leaderboard-item ${medals[i] || ""}">
      <span class="leaderboard-rank">#${i + 1}</span>
      <span class="leaderboard-name">${entry.name}</span>
      <span class="leaderboard-score">${entry.percentage}%</span>
    </li>
  `).join("");
  return `
    <div class="game-card results-card">
      <h2 class="results-title">Quiz Complete!</h2>
      <p class="results-score-display">${this.score}/${this.numberOfQuestions}</p>
      <p class="results-percentage">${percentage}% Accuracy</p>
      ${isNewHighScore ? `
        <div class="new-record-badge">
          <i class="fa-solid fa-star"></i> New High Score!
        </div>
      ` : ""}
      <div class="leaderboard">
        <h4 class="leaderboard-title">
          <i class="fa-solid fa-trophy"></i> Leaderboard
        </h4>
        <ul class="leaderboard-list">
          ${leaderboardItems}
        </ul>
      </div>
      <div class="action-buttons">
        <button class="btn-restart">
          <i class="fa-solid fa-rotate-right"></i> Play Again
        </button>
      </div>
    </div>
  `;
}
}