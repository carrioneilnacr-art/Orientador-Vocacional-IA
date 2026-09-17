import fs from 'fs';

const content = fs.readFileSync('./src/data/questionnaireData.ts', 'utf-8');

// We'll extract the options array using a simple regex/eval or just parsing
const regex = /VERIFIED_64_OPTIONS:\s*OptionItem\[\]\s*=\s*(\[[\s\S]*?\]);/m;
const match = content.match(regex);

if (match) {
  // Hack to evaluate the JS object array since it's valid JS except for typing
  const optionsStr = match[1];
  const options = eval(optionsStr);

  const maxPerDim = {};
  
  // Group by questionId
  const byQuestion = {};
  for(const opt of options) {
    if(!byQuestion[opt.questionId]) byQuestion[opt.questionId] = [];
    byQuestion[opt.questionId].push(opt);
  }

  for(const qId in byQuestion) {
    const qOpts = byQuestion[qId];
    
    // For each dimension, find the max score in this question
    const localMax = {};
    for (const opt of qOpts) {
      for (const [dim, score] of Object.entries(opt.scorePayload)) {
        if (!localMax[dim] || score > localMax[dim]) {
          localMax[dim] = score;
        }
      }
    }
    
    // Add local max to total max
    for (const dim in localMax) {
      if (!maxPerDim[dim]) maxPerDim[dim] = 0;
      maxPerDim[dim] += localMax[dim];
    }
  }

  console.log("Calculated Max Possible Scores per Dimension:");
  console.log(maxPerDim);
}
