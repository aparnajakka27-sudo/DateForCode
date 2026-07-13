import jsQuestions from './javascript.json';
import pyQuestions from './python.json';
import tsQuestions from './typescript.json';
import reactQuestions from './react.json';
import nextjsQuestions from './nextjs.json';

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
