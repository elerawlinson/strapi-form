import React, { useState, useEffect } from "react";
import { getSurvey } from "../services/api.tsx";
import Question from "./Question.tsx";

//Defining Props (shape and requirements for properties passed to components)

interface SurveyQuestion { 
  questionKey: number; 
  Text: string; 
  branchLogic?: string; 
}

interface SurveyData {
  questions: SurveyQuestion[]; 
}

interface SurveyProps {
  onSurveyEnd: (answers: Record <number, any>) => void;
}


const Survey: React.FC<SurveyProps> = ({ onSurveyEnd }) => { 
  //defining the necessary State variables 
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<SurveyQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  //const [CRname, setCRname] = useState<string | null>(null); 
  //const [FCGname, setFCGname] = useState<string | null>(null); 
  const [questionHistory, setQuestionHistory] = useState<number[]>([]);
  const [numQuestions, setNumQuestions] = useState<number>(0);


  //populate SurveyData using useEffect Hook (empty dependency array = only run once when the component mounts)
  useEffect(() => {
    getSurvey('kr3m00nbg1brcbjfwjyhlxeq').then((res) => {
      const data: SurveyData = res.data.data;
      setSurvey(data);
      setCurrentQuestion(data.questions[0]); // Start with the first question
      setNumQuestions(data.questions.length); 
      console.log("Payload is", data)
    });
  }, []);  

  
  //if curr question isn't defined or survey hasnt been initiated show loading message 
  if (!survey || !currentQuestion) return <p> "Loading survey..."</p>;


  //handleAnswer - callback for Question.tsk: updates key state variables (history, for previous navigation, and answers), sets current question, sets next question
  const handleAnswer = (questionKey: number, answerValue: any) => {
    let nextQuestionKey: number | null = null;
    
    setQuestionHistory(prev => [...prev, questionKey]);
    setAnswers((prev) => ({ 
      ...prev,
      [questionKey]: answerValue,
    }
  ));
  
  
    // Find the current question object by ID
    const current = currentQuestion;  
    if (!current) {
      console.warn("Question not found");
      return;
    }

    // Parse branchLogic field to determine next question
    const logicStr = current.branchLogic;
    if (logicStr) {

      //clean answer 
      const answerValue_cleaned = Array.isArray(answerValue)
      ? answerValue[0]?.trim?.()
      : typeof answerValue === 'string'
        ? answerValue.trim()
        : '';
          
      const lines = logicStr.split('\n').map(line => line.trim()).filter(Boolean);
      for (const line of lines) {
        const match = line.match(/answer_value:\s*"?([^"]+)"?:\s*next_question:\s*(-?\d+)/);
        if (match) {
            const value = match[1].trim();
            const nextKey = parseInt(match[2].trim(), 10); // turn "3" → 3
          if (value === answerValue_cleaned || value === "any") {
            nextQuestionKey = nextKey;
            break;}
        }
        else{
          nextQuestionKey= null; 
        }
      }
    }


    //implementing branching logic 
    if (nextQuestionKey == -1){ //some condition was not met by cr/fcg, so we go to end page
      onSurveyEnd(answers); 
      return; 
    }

    // If no branch matched or no logic provided, go to next question in numerical order
    if (!nextQuestionKey){
      const currentIndex = survey.questions.findIndex(q => q.questionKey === questionKey);
      if (currentIndex !== -1 && currentIndex + 1 < survey.questions.length) {
        nextQuestionKey = survey.questions[currentIndex + 1].questionKey;
      } else {
        nextQuestionKey = null; // End of survey
      }
    }
  

    // Move to the next question if found
    if (nextQuestionKey) {
      const nextQuestion = survey.questions.find(
        (q) => q.questionKey === nextQuestionKey
      );
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      } else {
        console.log("Next question not found. Ending survey.");
        if (onSurveyEnd) onSurveyEnd(answers);
      }
    } else {
      console.log("End of survey reached.");
      if (onSurveyEnd) onSurveyEnd(answers);
    }
  }; 

  //handle previous button selection 
  const handlePrevious = () => {
    //update question history 
    setQuestionHistory(prev => {
      const newHistory = [...prev];
      const prevKey = newHistory.pop(); // last question we were on (remove last element from array and return it)
  
      if (prevKey !== undefined) {
        const prevQuestion = survey.questions.find(q => q.questionKey === prevKey);
        if (prevQuestion) {
          setCurrentQuestion(prevQuestion); //change so we're rendering the previous question 
        }
      }
      return newHistory;
    });
  };

  //return - call question 
  return (
    <div>
       {/* # 3 is callback function- when the user clicks next, calls this function in survey component*/}
      <h2>{currentQuestion.Text}</h2>
      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        onPrevious={handlePrevious}
        userAnswer={answers[currentQuestion.questionKey]}
        NUM_QUESTIONS={numQuestions}
      />
    </div>
  );
  
}


  

export default Survey;
