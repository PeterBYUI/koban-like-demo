import { useState } from "react";

export default function useSecureInput(checkingFunction) {
  const [enteredData, setEnteredData] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);

  function handleUpdateData(e) {
    setEnteredData(e.target.value);
  }

  function resetEnteredData() {
    setEnteredData("");
    setIsBlurred(false);
  }

  return {
    enteredData,
    handleUpdateData,
    resetEnteredData,
    setIsBlurred,
    isBlurred,
    error: !checkingFunction(enteredData) && isBlurred,
    disabled: !checkingFunction(enteredData),
  };
}
