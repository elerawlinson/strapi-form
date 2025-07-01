import React, { useState } from "react";
import Survey from "../components/Survey.tsx";

const SurveyPage = () => {
  const [phase, setPhase] = useState("welcome"); // control the app phase - welcome, inProgress, or completed
  const handleStart = () => setPhase("inProgress");
  const handleSurveyEnd = () => setPhase("completed");

  if (phase === "welcome") {
    return (
      <div>
        <h1>Welcome to the Survey!</h1>
        <p>Instructions</p>
        <button onClick={handleStart}>Start Survey</button> 
      </div>
    );
  }

  //click button -> calls handle start -> sets phase to in progress -> evaluates in progress if statement -> renders (calls) survey and passes handlesurveyend as a callback 

  if (phase === "inProgress") {
    return <Survey onSurveyEnd={handleSurveyEnd} />; //setting phase to in progress doesn't run the handler yet, it just renders the Survey and passes on handler end as a prop, its a callback 
  }

  if (phase === "completed") {
    return (
      <div>
        <h1>Thank you for completing the survey!</h1>
      </div>
    );
  }

  return null;
};

export default SurveyPage;

