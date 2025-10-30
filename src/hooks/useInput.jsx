import { useState } from "react";

export default function useSecureInput(checkingFunction, errorCode) {
  const [enteredData, setEnteredData] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);

  function handleUpdateData(e) {
    setEnteredData(e.target.value);
  }

  return {
    enteredData,
    handleUpdateData,
    setIsBlurred,
    error: !checkingFunction(enteredData) && isBlurred,
  };
}
