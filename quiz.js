// Select Elements
let countSpan = document.querySelector(".count span");
let theBullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizeArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let theResultContainer = document.querySelector(".result");
let countDownSpan = document.querySelector(".cutedown");
 



//set option
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions(){
    let myRequest = new XMLHttpRequest()

    myRequest.onreadystatechange = function(){

        if(this.readyState ===4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText);
            let questionCount = questionObject.length;

            //create bullets + spans
            createBullets(questionCount);

            //add question data
            addQuestionData(questionObject[currentIndex], questionCount);

            //count down 
          
            countdown(5 , questionCount);

            //click on submit button
            submitButton.onclick = () => {
                //get right answer
                let rightAnswer = questionObject[currentIndex].right_answer;
                 
                //increase index
                currentIndex++;

                //check the answer
                checkAnswer(rightAnswer ,questionCount);

                //remove previese questions
                quizeArea.innerHTML = '';
                answerArea.innerHTML = '';

                //add question data
                addQuestionData(questionObject[currentIndex], questionCount);

                //handle bullets class
                handelBullets();

                //count down
                clearInterval(countdownInterval);
                countdown(5 , questionCount);

                //show result
                showResults(questionCount);
            }

        
        }
    }

    myRequest.open("GET", "question.json" , true);
    myRequest.send();
}
getQuestions()
                

//craete bullets function
function createBullets(num){
    countSpan.innerHTML = num;

    //create spans
    for(i = 0; i < num; i++){

        ///crete bullet
        let theBullet = document.createElement("span");

        //check if it the first question
        if( i ===0 ){
            theBullet.className = "on";
        }

        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj , count){
   
    if(currentIndex < count){

         //create h2 question
    let questionTitle = document.createElement("h2");

    //create question text
    let questionText = document.createTextNode(obj['title'])

    questionTitle.appendChild(questionText);

    quizeArea.appendChild(questionTitle);

    //create the answers
    for (let i=1; i <= 4; i++ ){

        //create the main div
        let mainDiv = document.createElement('div');
        mainDiv.className = "answers";

        //create radio input
        let radioInput = document.createElement("input");

        //add type+name + data attribute + id
        radioInput.type = 'radio';
        radioInput.name = 'question';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`]

        // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

        //create lable
        let theLable = document.createElement('label');

        theLable.htmlFor = `answer_${i}`;

        let theLableText = document.createTextNode(obj[`answer_${i}`]);

        theLable.appendChild(theLableText);

        //add input and the lable for main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLable);

        //add main div in answer area in page
        answerArea.appendChild(mainDiv);

    }
    }


}

function checkAnswer(rAnswer , count){
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;

    for(let i =0; i <answers.length; i++){

        if(answers[i].checked){

            theChoosenAnswer = answers[i].dataset.answer;

        }

    }
   
    if( rAnswer === theChoosenAnswer){
        rightAnswers++;
         
    } 

}

function handelBullets(){
    let bulletsSpans  = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) =>{
        
        if(currentIndex === index){
            span.className = "on";
        }
    })
}

function showResults(count){
    let theResult;
    if(currentIndex === count){
        quizeArea.remove();
        answerArea.remove();
        submitButton.remove();
        theBullets.remove();

        if(rightAnswers > (count / 2) && rightAnswers < count ){
            theResult = `<span class="good"> Good</span>, ${rightAnswers} from ${count}`;
            document.getElementById("goood").play();
        }else if (rightAnswers === count){
            theResult = `<span class="perfect"> Perfect</span>, ${rightAnswers} from ${count}`;
            document.getElementById("perf").play();
        }else{
            theResult = `<span class="bad"> Bad </span>, ${rightAnswers} from ${count}`;
            document.getElementById("badd").play()
           
        }

        theResultContainer.classList.add("final-result")
        theResultContainer.innerHTML = theResult;
    }
}


function countdown(duration , count){
    if(currentIndex < count){
        let minutes , seconds;
        countdownInterval = setInterval( () =>   {
            
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownSpan.innerHTML = `${minutes} : ${seconds}`;

            if(--duration < 0 ){
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000);
    }
}