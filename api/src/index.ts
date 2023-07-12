import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { Document } from 'mongoose';

const app = express();
const port = 3006;
const mongodb = "mongodb+srv://javedmushahid:mushahid@cluster0.hqtcalz.mongodb.net/?retryWrites=true&w=majority";

interface IStep {
  carryString: string;
  sumString: string;
}

interface IStepAddition extends Document {
  number1: number;
  number2: number;
  stepid: number;
  result: IStep[];
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongodb);
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the schema and model for Step Addition
const stepAdditionSchema = new mongoose.Schema<IStepAddition>({
  number1: { type: Number, required: true },
  number2: { type: Number, required: true },
  stepid: { type: Number, required: true },
  result: [
    {
      carryString: String,
      sumString: String,
    },
  ],
});
const StepAddition = mongoose.model<IStepAddition>('StepAddition', stepAdditionSchema);

// Routes
app.get('/api/step-addition', async (req: Request, res: Response) => {
  try {
    const data = await StepAddition.find({}).sort({ _id: -1 }).limit(10);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/step-addition', async (req: Request, res: Response) => {
  const { number1, number2 } = req.body;

  let n1 = parseInt(number1);
  let n2 = parseInt(number2);

  if (isNaN(n1) || isNaN(n2) || n1 <= 0 || n2 <= 0) {
    res.status(400).send('Please enter positive numbers only.');
    return;
  }

  let steps: IStep[] = [];
  let carryString = '';
  let sumString = '';

  while (n1 > 0 || n2 > 0) {
    const digit1 = n1 % 10;
    const digit2 = n2 % 10;
    const digitSum = digit1 + digit2;
    const carry = Math.floor(digitSum / 10);
    const sumDigit = digitSum % 10;

    carryString = carry + carryString;
    sumString = sumDigit + sumString;

    if (carryString !== '0' || sumString !== '0') {
      steps.push({
        carryString: `${carryString === '0' ? '' : carryString}_`,
        sumString,
      });
    }

    n1 = Math.floor(n1 / 10) + carry;
    n2 = Math.floor(n2 / 10);
  }

  try {
    const latestStep = await StepAddition.findOne().sort({ stepid: -1 }).exec();
    const newStepAddition = new StepAddition({
      number1,
      number2,
      stepid: latestStep ? latestStep.stepid + 1 : 1,
      result: steps,
    });
    await newStepAddition.save();
    res.status(201).send({
      message: 'Step Addition saved successfully.',
      // data: result
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
