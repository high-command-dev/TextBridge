const charVal = document.getElementById('editableEditor');
const checkButton = document.getElementById('checkButton');
const clearButton = document.getElementById('clearButton');
const copyButton = document.getElementById('copyButton');
const totalCounter = document.getElementById('total-counter');
const remainingCounter = document.getElementById('remaining-counter');
let finalSentence = ''

// Add text input listener to update counters dynamically

charVal.addEventListener('input', () => {
  let currentText = charVal.innerText;
  const maxLength = 150;

  if (currentText.length > maxLength) {
    charVal.innerText = currentText.substring(0, maxLength);
    alert("Reached Max length");
    // Move the cursor to the end
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(charVal);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    return;
  }

  totalCounter.innerText = charVal.innerText.length;
  remainingCounter.innerText = maxLength - charVal.innerText.length;
});



// Add click event listener for grammar check
checkButton.addEventListener('click', function (event) {
  if (event.target.innerText === 'Check') {
    
    checkGrammar();
  } 
  else if (event.target.innerText === 'Correct Text') {
    editableEditor.innerText = finalSentence;
    checkButton.innerText = 'Check';
  }
})
//Clear functionality 
clearButton.addEventListener('click', function (event) {
  if(event.target.innerText==='Clear'){
  charVal.innerText = ''; 
  totalCounter.innerText = '0'; 
  remainingCounter.innerText = '150'; 
  checkButton.innerText = 'Check'; 
  finalSentence = ''; 
  console.log('Editor cleared');}
});
//Copy Functionality
copyButton.addEventListener('click', function (event) {
  if (event.target.innerHTML === 'Copy') {
    const textToCopy = charVal.innerText.trim(); 

    if (!textToCopy) {
      alert('Nothing to copy! Please type some text.');
      return;
    }

    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Text copied to clipboard!');
        console.log('Copied text:', textToCopy);
      })
      
    }
  
  else {
    console.log('Unexpected button state');
  }
});






function checkGrammar() {
  //define the API URL
  const apiUrl = 'https://api.languagetool.org/v2/check';
  const languageCode = 'en-US';
  const textToCheck = charVal.innerHTML;
  console.log(textToCheck);
  if (!textToCheck) {
    alert('Please enter some text to check!');
    return;
  }

  
  fetch(`${apiUrl}?text=${encodeURIComponent(textToCheck)}&language=${languageCode}`)
    .then(response => {
      if (!response.ok) {

        throw new Error('Network response was not ok');

      }
      return response.json();
    })
    .then( data => {

      if (data.matches && data.matches.length > 0) {
        console.log(applyCorrections(textToCheck, data.matches));

      
        const { message, replacements, correctedText } = applyCorrections(textToCheck, data.matches);
        

        let textArray = textToCheck.split(' ');
        let correctedArray = correctedText.split(' ');
        finalSentence = correctedText;
        console.log(textArray);
        console.log(correctedArray);
        let result = [];
        let count = 0;

        for (let i = 0; i < textArray.length; i++) {
          if (textArray[i] !== correctedArray[i]) {
            //it should be check
result[i]=`<span class="correctionRequired">
                          ${textArray[i]}
                          <div class="tooltip">
                            ${message[count]}<br>
                            Suggested: ${replacements[count]}
                          </div>
                        </span>`;
            count+= 1; 
          } 
          else {
            result[i] = textArray[i];
          }
        }

        editableEditor.innerHTML = result.join(' ');
        checkButton.innerText = 'Correct Text';
        console.log(editableEditor);
      } 
      
    })
    
}



function applyCorrections(content, matches) {
  let editorText = content;
  let returnObj = {
    message: [],
    replacements: [],
    correctedText: '',
  }

  for (const match of matches) {
    const toBeModified = content.substring(match.offset, (match.offset + match.length));

    returnObj.message.push(match.message);
    returnObj.replacements.push(match.replacements[0].value);

    editorText = editorText.replace(toBeModified, match.replacements[0].value);
    returnObj.correctedText = editorText;
  }
  return returnObj;
}



