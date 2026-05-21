import jsQuestions from './javascript.json';
import pyQuestions from './python.json';
import tsQuestions from './typescript.json';
import reactQuestionsRaw from './react.json';
import nextjsQuestions from './nextjs.json';

const reactNullReplacements = [
  "JavaScript XML", // Q1 (Correct)
  "useEffect", // Q2 (Distractor)
  "<Component name=\"John\" />", // Q3 (Correct)
  "componentWillMount", // Q4 (Distractor)
  "Runs on every render", // Q5 (Distractor)
  "A direct copy of the DOM", // Q6 (Distractor)
  "Use React.memo() or shouldComponentUpdate()", // Q7 (Correct)
  "Maintains DOM reference", // Q8 (Distractor)
  "Only call hooks inside class components", // Q9 (Distractor)
  "To handle state globally", // Q10 (Distractor)
  "Passing props deep down through components that do not need them", // Q11 (Distractor)
  "Controlled components are faster", // Q12 (Distractor)
  "Handles component caching", // Q13 (Distractor)
  "Alternative to useState for simple state", // Q14 (Distractor)
  "Syncing the virtual DOM with the real DOM", // Q15 (Correct)
  "Allows refs to be passed to parent components", // Q16 (Distractor)
  "An element container", // Q17 (Correct)
  "To call functions synchronously", // Q18 (Distractor)
  "Immediately after the first render", // Q19 (Distractor)
  "useMemo memoizes values; useCallback memoizes functions", // Q20 (Correct)
  "A hook for runtime errors", // Q21 (Distractor)
  "Prevents any event dispatching", // Q22 (Distractor)
  "A higher priority rendering layer", // Q23 (Distractor)
  "A function to track dependency array changes", // Q24 (Distractor)
  "setState(prev => prev + 1)", // Q25 (Correct)
  "useDOMElement", // Q26 (Distractor)
  "Highlights potential problems by checking warnings", // Q27 (Correct)
  "State is destroyed instantly", // Q28 (Distractor)
  "Passing JSX content via rendering props", // Q29 (Correct)
  "Allows child components to render HTML", // Q30 (Distractor)
  "Splitting state variables", // Q31 (Distractor)
  "The Link component", // Q32 (Distractor)
  "State is immutable, props are mutable", // Q33 (Distractor)
  "Injects CSS styles securely", // Q34 (Distractor)
  "Wrap with React.memo()", // Q35 (Correct)
  "It is used for component styles", // Q36 (Distractor)
  "{condition ? <A /> : <B />}", // Q37 (Correct)
  "Executing React code on the server side", // Q38 (Correct)
  "To execute side effects synchronously", // Q39 (Distractor)
  "A state management tool", // Q40 (Distractor)
  "A component with no props", // Q41 (Distractor)
  "Renders children into a separate DOM node hierarchy", // Q42 (Correct)
  "state.name = 'John'", // Q43 (Distractor)
  "useLayoutEffect is asynchronous", // Q44 (Distractor)
  "A hydration data framework", // Q45 (Distractor)
  "React events are identical to browser events", // Q46 (Distractor)
  "Props can flow two ways in strict mode", // Q47 (Distractor)
  "When you want to force re-render", // Q48 (Distractor)
  "To derive parent state from child props", // Q49 (Distractor)
  "Allows multiple virtual DOM trees" // Q50 (Distractor)
];

const reactQuestions = {
  ...reactQuestionsRaw,
  questions: reactQuestionsRaw.questions.map((q, idx) => ({
    ...q,
    options: q.options.map((opt) => (opt === null ? (reactNullReplacements[idx] || "Placeholder Option") : opt))
  }))
};
import nodejsQuestions from './nodejs.json';
import javaQuestions from './java.json';
import cppQuestions from './cpp.json';
import htmlCssQuestions from './html-css.json';
import sqlQuestions from './sql.json';
import gitQuestions from './git.json';
import rustQuestions from './rust.json';
import goQuestions from './go.json';
import dockerQuestions from './docker.json';
import awsQuestions from './aws.json';
import flutterQuestions from './flutter.json';

// All 16 skill question banks — 50 questions each
const questionBanks: Record<string, {skill:string, questions:{id:number,q:string,options:string[],answer:number}[]}> = {
  javascript: jsQuestions,
  python: pyQuestions,
  typescript: tsQuestions,
  react: reactQuestions,
  nextjs: nextjsQuestions,
  nodejs: nodejsQuestions,
  java: javaQuestions,
  cpp: cppQuestions,
  'html-css': htmlCssQuestions,
  sql: sqlQuestions,
  git: gitQuestions,
  rust: rustQuestions,
  go: goQuestions,
  docker: dockerQuestions,
  aws: awsQuestions,
  flutter: flutterQuestions,
};

export function getRandomQuestions(skillId: string, count: number = 10) {
  const bank = questionBanks[skillId] || questionBanks.javascript;
  const shuffled = [...bank.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const PASS_MARK = 7;
export const TOTAL_QUESTIONS = 10;
