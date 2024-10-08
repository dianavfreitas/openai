import React, { useState } from "react";
import "../css/questions.css";
import { useLocation } from "react-router-dom";

export default function Questions() {
  // State to manage the current question index and user input
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const location = useLocation();
  const quizData = location.state;

  // Early return if no quiz data is available
  if (!quizData) {
    return <p>No quiz data available.</p>;
  }

  // Get the questions from quizData
  const questions = quizData.Questions;

  // Handle changes to the user input
  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  // Handle submission of the user's answer
  const handleSubmitAnswer = async () => {
    if (userAnswer.trim() === "") {
      setFeedback("Please enter an answer.");
      return;
    }

    // Mock API call or processing logic
    // Ideally, send userAnswer to your backend API to grade it
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const quiz = {
        Topic: quizData.Topic,
        Expertise: quizData.Expertise,
        NumberOfQuestions: quizData.NumberOfQuestions,
        StyleOfQuestion: quizData.StyleOfQuestion,
        Questions: questions.map((q, index) => ({
          Question: q.Question,
          Answer: q.Answer,
          UserAnswer:
            index === currentQuestionIndex ? userAnswer : q.UserAnswer,
          Source: q.Source,
        })),
      };

      // Example API call
      const response = await fetch("http://localhost:3000/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Quiz: quiz,
          UserAnswers: { [currentQuestionIndex]: userAnswer },
        }),
      });

      const data = await response.json();
      setQuizResults(data.results);
      setShowResults(true);
    } catch (error) {
      setFeedback("An error occurred while grading the answer.");
    }
  };

  // Handle navigation to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setFeedback("");
      setShowResults(false);
    }
  };

  // Handle navigation to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer("");
      setFeedback("");
      setShowResults(false);
    }
  };

  return (
    <div className="questions-container">
      <h1>
        Question {currentQuestionIndex + 1} of {questions.length}
      </h1>
      <h3>Question</h3>
      <p>{questions[currentQuestionIndex].Question}</p>
      <h3>Your Answer</h3>
      <input
        type="text"
        value={userAnswer}
        onChange={handleAnswerChange}
        placeholder="Type your answer here"
      />
      <button
        className="waves-effect waves-light btn"
        onClick={handleSubmitAnswer}
      >
        SUBMIT ANSWER
      </button>
      {feedback && <p>{feedback}</p>}
      {showResults && quizResults && (
        <div className="results-section">
          <h3>Results</h3>
          {quizResults.Questions.map((q, index) => (
            <div key={index} className="result">
              <p>
                <strong>Question:</strong> {q.Question}
              </p>
              <p>
                <strong>Your Answer:</strong> {q.Answer.UserAnswer}
              </p>
              <p>
                <strong>Correct Answer:</strong> {q.Answer.Answer}
              </p>
              <p>
                <strong>Result:</strong>{" "}
                {q.Answer.Passed ? "Correct" : "Incorrect"}
              </p>
              <p>
                <strong>Reason:</strong> {q.Answer.Reason}
              </p>
              <p>
                <strong>Source:</strong> {q.Answer.Source}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="navigation-buttons">
        <button
          className="waves-effect waves-light btn"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className="waves-effect waves-light btn"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
