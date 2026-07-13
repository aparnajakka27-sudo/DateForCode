import pythonCodingRaw from './questions/python_coding.json';

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface CodingQuestion {
  id: number;
  title: string;
  desc: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starter: string;
  functionName?: string;
  visibleTestCases?: TestCase[];
  hiddenTestCases?: TestCase[];
  testCases: { input: string; expected: string }[];
}

export const CODING_STACKS = ['javascript', 'python', 'cpp', 'typescript', 'sql', 'react', 'nodejs', 'nextjs'] as const;

const getStarterCode = (funcName: string): string => {
  switch (funcName) {
    case 'findMedianSortedArrays': return `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your code here\n    pass`;
    case 'isMatch': return `def isMatch(s: str, p: str) -> bool:\n    # Write your code here\n    pass`;
    case 'mergeKLists': return `def mergeKLists(lists: list[list[int]]) -> list[int]:\n    # Write your code here\n    pass`;
    case 'reverseKGroup': return `def reverseKGroup(head: list[int], k: int) -> list[int]:\n    # Write your code here\n    pass`;
    case 'findSubstring': return `def findSubstring(s: str, words: list[str]) -> list[int]:\n    # Write your code here\n    pass`;
    case 'longestValidParentheses': return `def longestValidParentheses(s: str) -> int:\n    # Write your code here\n    pass`;
    case 'firstMissingPositive': return `def firstMissingPositive(nums: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'trap': return `def trap(height: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'solveNQueens': return `def solveNQueens(n: int) -> list[list[str]]:\n    # Write your code here\n    pass`;
    case 'isMatchWildcard': return `def isMatchWildcard(s: str, p: str) -> bool:\n    # Write your code here\n    pass`;
    case 'longestIncreasingPath': return `def longestIncreasingPath(matrix: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'minJumps': return `def minJumps(arr: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'minCut': return `def minCut(s: str) -> int:\n    # Write your code here\n    pass`;
    case 'findLadders': return `def findLadders(beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:\n    # Write your code here\n    pass`;
    case 'findWords': return `def findWords(board: list[list[str]], words: list[str]) -> list[str]:\n    # Write your code here\n    pass`;
    case 'minDistance': return `def minDistance(word1: str, word2: str) -> int:\n    # Write your code here\n    pass`;
    case 'maximalRectangle': return `def maximalRectangle(matrix: list[list[str]]) -> int:\n    # Write your code here\n    pass`;
    case 'largestRectangleArea': return `def largestRectangleArea(heights: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'maxPathSum': return `def maxPathSum(root: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'maxProfit': return `def maxProfit(k: int, prices: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'LFUCache': return `class LFUCache:\n    def __init__(self, capacity: int):\n        # Initialize LFU cache\n        pass\n\n    def get(self, key: int) -> int:\n        # Get key value\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        # Put key value\n        pass`;
    case 'wordBreak': return `def wordBreak(s: str, wordDict: list[str]) -> list[str]:\n    # Write your code here\n    pass`;
    case 'maxSlidingWindow': return `def maxSlidingWindow(nums: list[int], k: int) -> list[int]:\n    # Write your code here\n    pass`;
    case 'countSmaller': return `def countSmaller(nums: list[int]) -> list[int]:\n    # Write your code here\n    pass`;
    case 'removeInvalidParentheses': return `def removeInvalidParentheses(s: str) -> list[str]:\n    # Write your code here\n    pass`;
    case 'serializeAndDeserialize': return `class Codec:\n    def serialize(self, root: list[int]) -> str:\n        # Serialize tree\n        return ""\n\n    def deserialize(self, data: str) -> list[int]:\n        # Deserialize tree\n        return []`;
    case 'MedianFinder': return `class MedianFinder:\n    def __init__(self):\n        # Initialize Median Finder\n        pass\n\n    def addNum(self, num: int) -> None:\n        # Add a number\n        pass\n\n    def findMedian(self) -> float:\n        # Return median\n        return 0.0`;
    case 'addOperators': return `def addOperators(num: str, target: int) -> list[str]:\n    # Write your code here\n    pass`;
    case 'NumMatrix': return `class NumMatrix:\n    def __init__(self, matrix: list[list[int]]):\n        # Initialize matrix\n        pass\n\n    def update(self, row: int, col: int, val: int) -> None:\n        # Update value\n        pass\n\n    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:\n        # Return region sum\n        return 0`;
    case 'findItinerary': return `def findItinerary(tickets: list[list[str]]) -> list[str]:\n    # Write your code here\n    pass`;
    case 'splitArray': return `def splitArray(nums: list[int], k: int) -> int:\n    # Write your code here\n    pass`;
    case 'canCross': return `def canCross(stones: list[int]) -> bool:\n    # Write your code here\n    pass`;
    case 'strongPasswordChecker': return `def strongPasswordChecker(password: str) -> int:\n    # Write your code here\n    pass`;
    case 'isRectangleCover': return `def isRectangleCover(rectangles: list[list[int]]) -> bool:\n    # Write your code here\n    pass`;
    case 'trapRainWater': return `def trapRainWater(heightMap: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'calculate': return `def calculate(s: str) -> int:\n    # Write your code here\n    pass`;
    case 'cutOffTree': return `def cutOffTree(forest: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'cherryPickup': return `def cherryPickup(grid: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'swimInWater': return `def swimInWater(grid: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'WordFilter': return `class WordFilter:\n    def __init__(self, words: list[str]):\n        # Initialize dictionary filter\n        pass\n\n    def f(self, pref: str, suff: str) -> int:\n        # Return largest index\n        return -1`;
    case 'evaluateLisp': return `def evaluateLisp(expression: str) -> int:\n    # Write your code here\n    pass`;
    case 'crackSafe': return `def crackSafe(n: int, k: int) -> str:\n    # Write your code here\n    pass`;
    case 'minSwapsCouples': return `def minSwapsCouples(row: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'slidingPuzzle': return `def slidingPuzzle(board: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'maxCoins': return `def maxCoins(nums: list[int]) -> int:\n    # Write your code here\n    pass`;
    case 'maxPoints': return `def maxPoints(points: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'minWindow': return `def minWindow(s: str, t: str) -> str:\n    # Write your code here\n    pass`;
    case 'maxEnvelopes': return `def maxEnvelopes(envelopes: list[list[int]]) -> int:\n    # Write your code here\n    pass`;
    case 'numDistinct': return `def numDistinct(s: str, t: str) -> int:\n    # Write your code here\n    pass`;
    case 'maxCoinsTwo': return `def maxCoinsTwo(values: list[int]) -> int:\n    # Write your code here\n    pass`;
    default: return `def ${funcName}():\n    # Write your code here\n    pass`;
  }
};

const PY: CodingQuestion[] = (pythonCodingRaw as any[]).map((q: any) => {
  const visible = q.visibleTestCases || [];
  const hidden = q.hiddenTestCases || [];
  const combinedTestCases = [
    ...visible.map((tc: any) => ({ input: tc.input, expected: tc.expectedOutput })),
    ...hidden.map((tc: any) => ({ input: tc.input, expected: tc.expectedOutput })),
  ];
  const constraintsStr = q.constraints && q.constraints.length > 0 
    ? `\n\nConstraints:\n${q.constraints.map((c: string) => `- ${c}`).join('\n')}` 
    : '';

  return {
    id: q.id,
    title: q.title,
    desc: q.description + constraintsStr,
    difficulty: q.difficulty as any,
    starter: getStarterCode(q.functionName),
    functionName: q.functionName,
    visibleTestCases: visible,
    hiddenTestCases: hidden,
    testCases: combinedTestCases
  };
});

const JS: CodingQuestion[] = [
  {id:1,title:'Reverse a String',desc:'Write a function `reverseString(s)` that returns the reversed string.',difficulty:'Easy',starter:'function reverseString(s) {\n  // your code\n}',functionName:'reverseString',testCases:[{input:'reverseString("hello")',expected:'"olleh"'},{input:'reverseString("world")',expected:'"dlrow"'},{input:'reverseString("")',expected:'""'}]},
  {id:2,title:'Find Largest in Array',desc:'Write a function `findLargest(arr)` that returns the largest number.',difficulty:'Easy',starter:'function findLargest(arr) {\n  // your code\n}',functionName:'findLargest',testCases:[{input:'findLargest([1,5,3])',expected:'5'},{input:'findLargest([-1,-5,-3])',expected:'-1'},{input:'findLargest([42])',expected:'42'}]},
  {id:3,title:'Factorial',desc:'Write a function `factorial(n)` that returns n!.',difficulty:'Easy',starter:'function factorial(n) {\n  // your code\n}',functionName:'factorial',testCases:[{input:'factorial(5)',expected:'120'},{input:'factorial(0)',expected:'1'},{input:'factorial(1)',expected:'1'}]},
  {id:4,title:'Palindrome Check',desc:'Write `isPalindrome(s)` returning true/false.',difficulty:'Easy',starter:'function isPalindrome(s) {\n  // your code\n}',functionName:'isPalindrome',testCases:[{input:'isPalindrome("racecar")',expected:'true'},{input:'isPalindrome("hello")',expected:'false'}]},
  {id:5,title:'Remove Duplicates',desc:'Write `removeDups(arr)` returning array with no duplicates.',difficulty:'Medium',starter:'function removeDups(arr) {\n  // your code\n}',functionName:'removeDups',testCases:[{input:'removeDups([1,2,2,3])',expected:'[1,2,3]'},{input:'removeDups([1,1,1])',expected:'[1]'}]},
  {id:6,title:'Count Vowels',desc:'Write `countVowels(s)` returning the vowel count.',difficulty:'Easy',starter:'function countVowels(s) {\n  // your code\n}',functionName:'countVowels',testCases:[{input:'countVowels("hello")',expected:'2'},{input:'countVowels("xyz")',expected:'0'}]},
  {id:7,title:'Fibonacci',desc:'Write `fib(n)` returning the nth Fibonacci number.',difficulty:'Medium',starter:'function fib(n) {\n  // your code\n}',functionName:'fib',testCases:[{input:'fib(6)',expected:'8'},{input:'fib(0)',expected:'0'},{input:'fib(1)',expected:'1'}]},
  {id:8,title:'Flatten Array',desc:'Write `flatten(arr)` to flatten nested arrays.',difficulty:'Medium',starter:'function flatten(arr) {\n  // your code\n}',functionName:'flatten',testCases:[{input:'flatten([1,[2,[3]]])',expected:'[1,2,3]'},{input:'flatten([[1,2],[3]])',expected:'[1,2,3]'}]},
  {id:9,title:'Sum of Array',desc:'Write `sumArray(arr)` returning the sum.',difficulty:'Easy',starter:'function sumArray(arr) {\n  // your code\n}',functionName:'sumArray',testCases:[{input:'sumArray([1,2,3])',expected:'6'},{input:'sumArray([])',expected:'0'}]},
  {id:10,title:'Prime Check',desc:'Write `isPrime(n)` returning true if prime.',difficulty:'Medium',starter:'function isPrime(n) {\n  // your code\n}',functionName:'isPrime',testCases:[{input:'isPrime(7)',expected:'true'},{input:'isPrime(4)',expected:'false'},{input:'isPrime(1)',expected:'false'}]},
];

const CPP: CodingQuestion[] = [
  {id:1,title:'Reverse Array',desc:'Write a function to reverse an integer array in-place.',difficulty:'Easy',starter:'#include <vector>\nusing namespace std;\n\nvector<int> reverseArr(vector<int> arr) {\n  // your code\n  return arr;\n}',functionName:'reverseArr',testCases:[{input:'reverseArr({1,2,3})',expected:'{3,2,1}'},{input:'reverseArr({5})',expected:'{5}'}]},
  {id:2,title:'Max Subarray Sum',desc:'Find the maximum sum of a contiguous subarray (Kadane\'s).',difficulty:'Hard',starter:'int maxSubarraySum(vector<int>& nums) {\n  // your code\n  return 0;\n}',functionName:'maxSubarraySum',testCases:[{input:'maxSubarraySum({-2,1,-3,4,-1,2,1,-5,4})',expected:'6'},{input:'maxSubarraySum({1})',expected:'1'}]},
  {id:3,title:'Sort Array',desc:'Implement bubble sort on an integer array.',difficulty:'Easy',starter:'vector<int> bubbleSort(vector<int> arr) {\n  // your code\n  return arr;\n}',functionName:'bubbleSort',testCases:[{input:'bubbleSort({3,1,2})',expected:'{1,2,3}'}]},
  {id:4,title:'GCD of Two Numbers',desc:'Write a function to find GCD using Euclidean algorithm.',difficulty:'Easy',starter:'int gcd(int a, int b) {\n  // your code\n  return 0;\n}',functionName:'gcd',testCases:[{input:'gcd(12,8)',expected:'4'},{input:'gcd(7,3)',expected:'1'}]},
  {id:5,title:'Power Function',desc:'Write `power(base, exp)` without using pow().',difficulty:'Medium',starter:'long long power(int base, int exp) {\n  // your code\n  return 0;\n}',functionName:'power',testCases:[{input:'power(2,10)',expected:'1024'},{input:'power(3,0)',expected:'1'}]},
];

const TS: CodingQuestion[] = [
  {id:1,title:'Generic Stack',desc:'Implement a generic Stack<T> class with push, pop, peek.',difficulty:'Medium',starter:'class Stack<T> {\n  private items: T[] = [];\n  push(item: T): void { /* code */ }\n  pop(): T | undefined { /* code */ return undefined; }\n  peek(): T | undefined { /* code */ return undefined; }\n}',functionName:'Stack',testCases:[{input:'const s = new Stack<number>(); s.push(1); s.push(2); s.pop()',expected:'2'},{input:'s.peek()',expected:'1'}]},
  {id:2,title:'Type Guard',desc:'Write a type guard `isString(val)` for string type.',difficulty:'Easy',starter:'function isString(val: unknown): val is string {\n  // your code\n  return false;\n}',functionName:'isString',testCases:[{input:'isString("hello")',expected:'true'},{input:'isString(42)',expected:'false'}]},
  {id:3,title:'Merge Objects',desc:'Write `mergeObjects<T,U>(a:T, b:U)` merging two objects.',difficulty:'Easy',starter:'function mergeObjects<T extends object, U extends object>(a: T, b: U): T & U {\n  // your code\n  return {} as T & U;\n}',functionName:'mergeObjects',testCases:[{input:'mergeObjects({a:1},{b:2})',expected:'{"a":1,"b":2}'}]},
  {id:4,title:'Enum Days',desc:'Create a Days enum and a function returning if it is a weekend.',difficulty:'Easy',starter:'enum Days { Mon, Tue, Wed, Thu, Fri, Sat, Sun }\nfunction isWeekend(d: Days): boolean {\n  // your code\n  return false;\n}',functionName:'isWeekend',testCases:[{input:'isWeekend(Days.Sat)',expected:'true'},{input:'isWeekend(Days.Mon)',expected:'false'}]},
  {id:5,title:'Readonly Deep',desc:'Write a function that deep freezes an object.',difficulty:'Hard',starter:'function deepFreeze<T extends object>(obj: T): Readonly<T> {\n  // your code\n  return obj;\n}',functionName:'deepFreeze',testCases:[{input:'const o = deepFreeze({a:{b:1}}); typeof o',expected:'"object"'}]},
];

const SQL_Q: CodingQuestion[] = [
  {id:1,title:'Second Highest Salary',desc:'Write a query to find the second highest salary from Employee table.',difficulty:'Medium',starter:'-- Table: Employee(id, name, salary)\nSELECT -- your query',functionName:'secondHighestSalary',testCases:[{input:'Employee: [(1,"A",100),(2,"B",200),(3,"C",150)]',expected:'150'}]},
  {id:2,title:'Duplicate Records',desc:'Write a query to find duplicate emails in a Users table.',difficulty:'Easy',starter:'-- Table: Users(id, email)\nSELECT -- your query',functionName:'duplicateEmails',testCases:[{input:'Users: [(1,"a@b.com"),(2,"c@d.com"),(3,"a@b.com")]',expected:'"a@b.com"'}]},
  {id:3,title:'Department Avg Salary',desc:'Find employees earning above their department average.',difficulty:'Hard',starter:'-- Tables: Employee(id, name, salary, dept_id), Department(id, name)\nSELECT -- your query',functionName:'deptAvgSalary',testCases:[{input:'Employees with above-avg salary in their dept',expected:'Filtered rows'}]},
];

const REACT_Q: CodingQuestion[] = [
  {id:1,title:'Counter Component',desc:'Build a counter with increment, decrement, reset buttons using useState.',difficulty:'Easy',starter:'import { useState } from "react";\n\nexport default function Counter() {\n  // your code\n  return <div>Counter</div>;\n}',functionName:'Counter',testCases:[{input:'Click increment 3 times',expected:'Count: 3'},{input:'Click reset',expected:'Count: 0'}]},
  {id:2,title:'Todo List',desc:'Build a todo app with add, delete, and toggle complete.',difficulty:'Medium',starter:'import { useState } from "react";\n\nexport default function TodoApp() {\n  // your code\n  return <div>Todo</div>;\n}',functionName:'TodoApp',testCases:[{input:'Add "Buy milk"',expected:'List shows "Buy milk"'},{input:'Toggle complete',expected:'Item crossed out'}]},
  {id:3,title:'Search Filter',desc:'Build a component that filters a list based on search input.',difficulty:'Easy',starter:'import { useState } from "react";\nconst items = ["Apple","Banana","Cherry","Date"];\n\nexport default function SearchFilter() {\n  // your code\n  return <div>Search</div>;\n}',functionName:'SearchFilter',testCases:[{input:'Type "an"',expected:'Shows "Banana"'}]},
];

const NODE_Q: CodingQuestion[] = [
  {id:1,title:'HTTP Server',desc:'Create a simple HTTP server that responds with JSON.',difficulty:'Easy',starter:'const http = require("http");\n\n// Create server on port 3001\n// GET / => {"message": "Hello"}\n',functionName:'httpServer',testCases:[{input:'GET /',expected:'{"message":"Hello"}'},{input:'Status code',expected:'200'}]},
  {id:2,title:'File Reader',desc:'Write a function to read a file and count words.',difficulty:'Easy',starter:'const fs = require("fs");\n\nfunction countWords(filePath) {\n  // your code\n  return 0;\n}',functionName:'countWords',testCases:[{input:'countWords("hello world test")',expected:'3'}]},
  {id:3,title:'Express Middleware',desc:'Create a logging middleware that logs method + URL.',difficulty:'Medium',starter:'// Express middleware\nfunction logger(req, res, next) {\n  // your code\n  next();\n}',functionName:'logger',testCases:[{input:'GET /api/users',expected:'Log: GET /api/users'}]},
];

const NEXT_Q: CodingQuestion[] = [
  {id:1,title:'API Route',desc:'Create a Next.js API route that returns user data.',difficulty:'Easy',starter:'// pages/api/users.ts\nexport default function handler(req, res) {\n  // your code\n}',functionName:'handler',testCases:[{input:'GET /api/users',expected:'[{id:1,name:"User"}]'}]},
  {id:2,title:'Dynamic Route',desc:'Create a dynamic [id] page that displays product info.',difficulty:'Medium',starter:'// app/product/[id]/page.tsx\nexport default function Product({ params }) {\n  // your code\n  return <div>Product</div>;\n}',functionName:'Product',testCases:[{input:'/product/1',expected:'Shows product 1 details'}]},
  {id:3,title:'SSR Page',desc:'Create a page with server-side data fetching.',difficulty:'Medium',starter:'// Fetch data server-side\nexport default async function Page() {\n  // your code\n  return <div>SSR</div>;\n}',functionName:'Page',testCases:[{input:'Load page',expected:'Shows fetched data'}]},
];

export const codingQuestionBanks: Record<string, CodingQuestion[]> = {
  javascript: JS, python: PY, cpp: CPP, typescript: TS,
  sql: SQL_Q, react: REACT_Q, nodejs: NODE_Q, nextjs: NEXT_Q,
};

export function getRandomCodingQuestions(stack: string, count = 2): CodingQuestion[] {
  const bank = codingQuestionBanks[stack] || codingQuestionBanks.javascript;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

import mentorQuestionsRaw from './questions/mentor_questions.json';

export function getMentorCodingQuestions(lang = 'javascript'): CodingQuestion[] {
  return (mentorQuestionsRaw as any[]).map((q: any) => {
    const visible = q.visibleTestCases || [];
    const hidden = q.hiddenTestCases || [];
    const combinedTestCases = [
      ...visible.map((tc: any) => ({ input: tc.input, expected: tc.expectedOutput })),
      ...hidden.map((tc: any) => ({ input: tc.input, expected: tc.expectedOutput })),
    ];
    const constraintsStr = q.constraints && q.constraints.length > 0 
      ? `\n\nConstraints:\n${q.constraints.map((c: string) => `- ${c}`).join('\n')}` 
      : '';

    let starter = q.starterCode?.[lang] || q.starter || '';
    if (!starter) {
      if (lang === 'python') {
        starter = `def ${q.functionName}(input):\n    # Write your solution here\n    pass`;
      } else if (lang === 'javascript' || lang === 'typescript') {
        starter = `function ${q.functionName}(input) {\n    // Write your solution here\n    return null;\n}`;
      } else if (lang === 'cpp') {
        starter = `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement your method here\n};`;
      } else if (lang === 'java') {
        starter = `public class Main {\n    // Implement your method here\n}`;
      } else {
        starter = `// Implement your solution here`;
      }
    }

    return {
      id: q.id,
      title: q.title,
      desc: q.description + constraintsStr,
      difficulty: q.difficulty as any,
      starter,
      functionName: q.functionName,
      visibleTestCases: visible,
      hiddenTestCases: hidden,
      testCases: combinedTestCases
    };
  });
}
