const charVal = document.getElementById('editableEditor');
const checkButton = document.getElementById('checkButton');
const copyButton = document.getElementById('copyButton');
const totalCounter = document.getElementById('Total-counter');
const remainingCounter = document.getElementById('remaining-counter');
let finalSentence = '';

// Add text input listener to update counters dynamically
charVal.addEventListener('input', () => {
  const currentLength = charVal.innerText.length;
  totalCounter.innerText = currentLength;
  remainingCounter.innerText = 150 - currentLength; // Assuming 150 is max length
});

// Add click event listener for grammar check
checkButton.addEventListener('click', function () {
  if (checkButton.innerText === 'Check Text') {
    checkGrammar();
  } else if (checkButton.innerText === 'Correct Text') {
    charVal.innerText = finalSentence;
    checkButton.innerText = 'Check Text';
  }
});
// function checkGrammar() {
//   const apiUrl = 'https://api.languagetool.org/v2/check';

//   const languageCode = 'en-US';
//   const textToCheck = charVal.innerText.trim();
//   console.log('Sending request for text:', textToCheck);
//   if (!textToCheck) {
//     alert('Please enter some text to check!');
//     return;
//   }

//   console.log('Requesting grammar check for:', textToCheck); // Debugging
  
//   fetch(`${apiUrl}?text=${encodeURIComponent(textToCheck)}&language=${languageCode}`)
//     .then((response) => {
//       if (!response.ok) {
//         console.error('HTTP Error:', response.status, response.statusText);
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log('API Response:', data); // Debugging
//       if (data.matches && data.matches.length > 0) {
//         const { message, replacements, correctedText } = applyCorrections(textToCheck, data.matches);
//         finalSentence = correctedText;

//         const textArray = textToCheck.split(' ');
//         const correctedArray = correctedText.split(' ');

//         let result = [];
//         let count = 0;

//         for (let i = 0; i < textArray.length; i++) {
//           if (textArray[i] !== correctedArray[i]) {
//             result.push(` 
//               <span class="correctRequired">${textArray[i]}
//                 <div class="correction-content">
//                   <a href="#">Correction: ${replacements[count]}</a>
//                   <a href="#">${message[count]}</a>
//                 </div>
//               </span>`);
//             count++;
//           } else {
//             result.push(textArray[i]);
//           }
//         }

//         charVal.innerHTML = result.join(' ');
//         checkButton.innerText = 'Correct Text';
//       } else {
//         alert('No errors found. Great job!');
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error.message || error);
//       alert('There was a problem checking grammar. Please try again.');
//     });
// }
function checkGrammar() {
  // Simulate API response for testing
  const data = {
    matches: [
      {
        offset: 0,
        length: 5,
        message: "This is a test error.",
        replacements: [{ value: "Hello" }]
      }
    ]
  };

  console.log('Simulated API Response:', data);

  // Proceed with applying corrections
  if (data.matches && data.matches.length > 0) {
    const { message, replacements, correctedText } = applyCorrections('helo', data.matches);
    finalSentence = correctedText;

    const textArray = 'helo'.split(' ');
    const correctedArray = correctedText.split(' ');

    let result = [];
    let count = 0;

    for (let i = 0; i < textArray.length; i++) {
      if (textArray[i] !== correctedArray[i]) {
        result.push(` 
          <span class="correctRequired">${textArray[i]}
            <div class="correction-content">
              <a href="#">Correction: ${replacements[count]}</a>
              <a href="#">${message[count]}</a>
            </div>
          </span>`);
        count++;
      } else {
        result.push(textArray[i]);
      }
    }

    charVal.innerHTML = result.join(' ');
    checkButton.innerText = 'Correct Text';
  } else {
    alert('No errors found. Great job!');
  }
}

function applyCorrections(content, matches) {
  let editorText = content;
  const returnObj = {
    message: [],
    replacements: [],
    correctedText: '',
  };

  for (const match of matches) {
    const toBeModified = editorText.substring(match.offset, match.offset + match.length);

    returnObj.message.push(match.message);
    returnObj.replacements.push(match.replacements[0]?.value || '');

    editorText = editorText.replace(toBeModified, match.replacements[0]?.value || toBeModified);
  }

  returnObj.correctedText = editorText;
  return returnObj;
}
