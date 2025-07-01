import React, { useState, useEffect } from "react";
import {z} from 'zod'; 

//function to call usps API to validate zip codes ??

//zod schema defining validators 
const validators = {
  email: z.string().email({message: "Please enter a valid email address."}),
  zip: z.string().regex(/^\d{5}$/, { message: "ZIP must be 5 digits." }),
  name: z.string().min(2).max(10,{message: "Please enter your name"}), 
  phone_number: z.string().min(10).max(10,{message: "Please enter a valid phone number"}), 
}


//Validation function 
function validateQuestion(question) {

  //to make sure that the correct key from validators constant is invoked 
  const cleanedType = question.answer_type.replace(/[\s\u200B\u00A0]+/g, "").toLowerCase();
  const validator = validators[cleanedType];

  // If there is no validator defined for this question type, log a warning but let it pass through 
  if (!validator) {
    console.warn(`No validator found for type "${question.answer_type}"`);
    return { success: true }; // Allowing the question to pass, but this is up to you
  }

  try {
    console.log("Validating data type", cleanedType )
    validator.parse(question.value); //try to validate 

    // If it didn't throw an error, validation passed
    return { success: true };
  } catch (e) {
    // If it threw an error, we return the first error message (if available)
  
    return {
      success: false,
      error: e.errors?.[0]?.message || "Invalid input",
    };
  }
}


//Define props for Question 
interface SurveyQuestion { 
  questionKey: number; 
  Text: string; 
  branchLogic?: string; 
}



interface QuestionProps {
  question: SurveyQuestion & { [key: string]: any }; // known props + anything else - bc question fields might be changing
  onAnswer: (questionKey: number, answer: any) => void;
  onPrevious: () => void;
  userAnswer: any;
  NUM_QUESTIONS: number;
}


const Question: React.FC<QuestionProps> = ({ question, onAnswer, onPrevious, userAnswer, NUM_QUESTIONS }) => {

  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || "");
  
  useEffect (() => {
    setSelectedAnswer(userAnswer || " "); 
  }, [userAnswer]); 

  // Controls next button - based on if the question is required or not 
  let nextDisabled: boolean; 
  if (question.required){
    nextDisabled = !selectedAnswer || selectedAnswer.length === 0;
  } else{
    nextDisabled = false; 
  }


  // Load saved answers  
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('formAnswers'); 
    return saved ? JSON.parse(saved) : Array(NUM_QUESTIONS).fill('')
  }
  )

  //Save answers in local storage - when the component mounts AND whenever answers updates 
  useEffect(() => {
    localStorage.setItem('formAnswers', JSON.stringify(answers));
  }, [answers]);


  //Update the answers array - which is used to populate previous answers when you use the back button 
  const handleAnswerChange = (index, value) => {
    setAnswers(prev => {
      const newAnswers = [...prev]; 
      newAnswers[index] = value; 
      return newAnswers; 
    }
    )
  }

  // Called when the user clicks the Next button
  const handleNextClick = () => {
    if (question.required) { //if it was a required answer, do some data validation 
      //zod validation 
      const validation = validateQuestion({
        ...question,
        value: selectedAnswer,
      });
    
      if (!validation.success) {
        alert(validation.error);
        return;
      }
    }
  
    setSelectedAnswer(""); //clear input text box 
    onAnswer(question.questionKey, selectedAnswer); //call handle answer in Question component 
  };



  return (
    <div>
      {/* Display the question text */}
      <h3>{question.text}</h3>
      {/* render based on question type */}
      {question.question_type == "text" && (
        <input 
        type = "text"
        value = {selectedAnswer}
        onChange = {(e) => {
          const val = e.target.value; //not sure what exactly this is doing 
          setSelectedAnswer(e.target.value); 
          handleAnswerChange(question.questionKey, val);}
        }
        placeholder = "Type Your Answer"

        />
      )}

      {question.question_type === "single-choice" && (
        <div>
          {question.options.map((option) => (
            <label key = {option.Option}>
               <input
                type = "radio"
                name = {`question-${question.questionKey}`}
                value = {option.Option}
                checked = {selectedAnswer === option.Option}
                onChange = {(e) => {
                  const val = e.target.value;
                  setSelectedAnswer(e.target.value); 
                  handleAnswerChange(question.questionKey,  val );}
                }
                />
              {option.Option}
            </label>
          ))}
          </div>
      )}

      {question.question_type === "multiple-choice" && (
          <div>
            {question.options.map((option) => (
              <label key={option.Option}>
                <input
                  type="checkbox"
                  name={`question-${question.questionKey}`}
                  value={option.Option}
                  checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(option.Option)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let updated = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
                    if (checked) {
                      updated.push(option.Option);
                    } else {
                      updated = updated.filter((val) => val !== option.Option);
                    }
                    setSelectedAnswer(updated);
                    handleAnswerChange(question.questionKey, selectedAnswer);
                  }}
                />
                {option.Option}
              </label>
            ))}
          </div>
        )}

        {question.question_type === "just-click" && (
          <div>
            <h3>{question.text}</h3>
          </div>


        )}

        {/* Previous button */}
        <button onClick= {onPrevious}>
            Previous
          </button>

        {/* Next button */}
          <button onClick= {handleNextClick} disabled={nextDisabled}>
            Next
          </button>

    </div>
    
  );
};

export default Question;