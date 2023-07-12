import React, { useEffect, useState, ChangeEvent } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

interface Step {
  carryString: string;
  sumString: string;
}

interface StepAddition {
  _id: string;
  number1: string;
  number2: string;
  stepid: number;
  result: Step[];
}

function App(): JSX.Element {
  const [number1, setNumber1] = useState<string>("");
  const [number2, setNumber2] = useState<string>("");
  const [result, setResult] = useState<Step[]>([]);
  const [stepAdditions, setStepAdditions] = useState<StepAddition[]>([]);
  const [stepAddition, setStepAddition] = useState<StepAddition[]>([]);

  const BACKEND_URL = "http://localhost:3006";

  const handleNumber1Change = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setNumber1(value);
    }
  };

  useEffect(() => {
    fetchStepAdditions();
  }, []);

  const fetchStepAdditions = async () => {
    try {
      const response = await axios.get<StepAddition[]>(`${BACKEND_URL}/api/step-addition`);
      setStepAdditions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNumber2Change = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setNumber2(value);
    }
  };

  const handleGenerateSteps = async () => {
    try {
      const response = await axios.post<StepAddition>(`${BACKEND_URL}/api/step-addition`, {
        number1,
        number2,
      });
      console.log("res",response)
      fetchStepAdditions();
    } catch (error) {
      console.error("error from axios", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <div style={{ background: "gray", padding: "10px" }}>
        <Typography variant="h3" style={{ textAlign: "left" }}>
          Step Addition
        </Typography>
      </div>
      <div className="App" style={{ marginTop: "40px", marginLeft: "20px" }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h6">First number:</Typography>
          <TextField
            type="text"
            value={number1}
            onChange={handleNumber1Change}
            variant="outlined"
            inputProps={{ autocomplete: "off",placeholder:'Enter Number 1' }}
            sx={{ marginLeft: "40px", backgroundColor: "lightgray" }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Second number:</Typography>
          <TextField
            type="text"
            value={number2}
            onChange={handleNumber2Change}
            variant="outlined"
            inputProps={{ autocomplete: "off" ,placeholder:'Enter Number 2'}}
            sx={{ marginLeft: "10px", backgroundColor: "lightgray" }}
          />
        </Box>
        <Button
          onClick={handleGenerateSteps}
          // variant="contained"
          sx={{
            marginLeft: "190px",
            marginTop: "20px",
            padding: "10px 30px",
            border: "2px solid lightgray",
            color: "black",
          }}
        >
          Generate Steps
        </Button>
        {stepAdditions.length > 0 && (
          <div>
            <Typography variant="h6" style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}>
              Step Addition History:
            </Typography>
            {stepAdditions.map((stepAddition, index) => (
              <div key={index} style={{ background: "#001a33", color: "white", padding: "10px", marginTop: "10px" }}>
                <Typography variant="h6" style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
                  Step Addition {stepAddition.stepid}
                </Typography>
                {stepAddition.result.map((step, stepIndex) => (
                  <Typography key={stepIndex} style={{ margin: "5px" }}>
                    Step {stepIndex + 1}: "carryString": {step.carryString}, "sumString": {step.sumString}
                  </Typography>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}

export default App;
