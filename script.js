const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
  "#8b35bc",
  "#b163da",
  "#8b35bc",
  "#b163da",
  "#8b35bc",
  "#b163da",
];
//Create chart
let myChart = new Chart(wheel, {
  //Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  //Chart Type Pie
  type: "pie",
  data: {
    //Labels(values which are to be displayed on chart)
    labels: [1, 2, 3, 4, 5, 6],
    //Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      //display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});
//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Have fun watching: ${i.value} !</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

// Movie part starts here 
const showsArray = [
  {
    imgUrl: 'assets/not_available.jpg',
    cageNumber: '1',
  },
  {
    imgUrl: 'assets/not_available.jpg',
    cageNumber: '2',
  },
  {
    imgUrl: 'assets/not_available.jpg',
    cageNumber: '3',
  },
  {
    imgUrl: 'assets/not_available.jpg',
    cageNumber: '4',
  },
  {
    imgUrl: 'assets/not_available.jpg',
    cageNumber: '5',
  },
  {
    imgUrl: 'assets/not_available.jpg',
    cageNumber: '6',
  }
]

// query the Grid
const offersGrid = document.querySelector('.gridContainer')

function createCard(movie) {
  let content = `
    <div class="cage">
    <div Class="labelNumber">
    ${movie.cageNumber}
        </div>
        <div class="textInputs">
      <input class="inputField" type="text" id="movie${movie.cageNumber}" placeholder="Type the exact title and press enter">     
      <p class="inputFieldOverview" id="overview${movie.cageNumber}" placeholder="Overview should appear right here"></p>
      </div>
    <img class="imageGrid" id="img${movie.cageNumber}" src=${movie.imgUrl} alt="preview not available">
    </div>
  `;
  let card = document.createElement('div');

  // create the class "cage" to access the style in css
  card.classList.add('cage')

  // write the content of the card and create grid 
  card.innerHTML = content;
  return card;
}

for (let index = 0; index < showsArray.length; index++) {
  const card = createCard(showsArray[index])
  offersGrid.appendChild(card);
}

/*-------------------fetching movies-----------------------------*/
function apiCall(movieTitle, movieNumber) {

  /*when the movie title isn't empty do: */
  if (movieTitle !== '')
  {
   fetch('https://api.themoviedb.org/3/search/movie?api_key=b7a59d7d49fc9028ec9bba63da8c1a6a&query=' + movieTitle)
    .then(data => data.json())
    .then(data => 
      {
        const posterPage = `https://image.tmdb.org/t/p/w500/`;
        let dataObject = data;
        let imagePath = dataObject.results[0].poster_path;
        let overview = dataObject.results[0].overview;

        /*querying the overview text with the given parameter*/
        let newOverview = document.querySelector(`#overview${movieNumber}`);   
        newOverview = document.querySelector(`#overview${movieNumber}`).style.visibility = 'visible';   
        newOverview = document.querySelector(`#overview${movieNumber}`).innerText = overview;
          
          /*if the image is in the database, show the movie poster othervisw show the default img*/
          if (imagePath !== "N/A")
          {
           document.querySelector(`#img${movieNumber}`).setAttribute("src", `${posterPage}${imagePath}`);        
          } 
      })
    .catch(error => 
      {
      console.log(error);        
      })   
  } 
    /*else when the movie title is empty, clear the input and hide the overview text area*/    
  else 
  {
    document.querySelector(`#overview${movieNumber}`).style.visibility = 'hidden';   
    document.querySelector(`#overview${movieNumber}`).value = '';
    document.querySelector(`#img${movieNumber}`).setAttribute("src", `assets/not_available.jpg`);  
  }

}

// 1 if the Title was entered and enter pressed, call the JSON database
document.querySelector('#movie1').addEventListener('input', function() {
  var title = document.getElementById('movie1').value;
  console.log(title);
  apiCall(title,1);
});

// 2 look if the Title was entered and the button clicked
document.querySelector('#movie2').addEventListener('input', function() {
  var title = document.getElementById('movie2').value;
  console.log(title);
  apiCall(title,2);
});

// 3 look if the Title was entered and the button clicked
document.querySelector('#movie3').addEventListener('input', function() {
  var title = document.getElementById('movie3').value;
  console.log(title);
  apiCall(title,3);
});

// 4 look if the Title was entered and the button clicked
document.querySelector('#movie4').addEventListener('input', function() {
  var title = document.getElementById('movie4').value;
  console.log(title);
  apiCall(title,4);
});

// 5 look if the Title was entered and the button clicked
document.querySelector('#movie5').addEventListener('input', function() {
  var title = document.getElementById('movie5').value;
  console.log(title);
  apiCall(title,5);
});

// 6 look if the Title was entered and the button clicked
document.querySelector('#movie6').addEventListener('input', function() {
  var title = document.getElementById('movie6').value;
  console.log(title);
  apiCall(title,6);
});

//full poster_path example":"https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg

