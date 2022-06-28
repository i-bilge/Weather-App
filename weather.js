const form = document.querySelector("form");
const input = document.querySelector("input");
const list = document.querySelector(".cities");
const msg = document.querySelector(".msg");
const loadingContainer = document.querySelector(".loading-container");
//Here we are taking our elements from Html
//------------------------------------------------------------------------
const apiKey = "dff455aa272ddcf08a17c8ef26aae499"; //that s our key to use Api

const clearMessage = () => {
  setTimeout(() => {
    msg.innerText = "";
  }, 3000);
};
// Here we are deleting our message after 3 seconds
//--------------------------------------------------------------------------

//THEN WE ARRE STARTING TO WRITE OUR LISTENER:
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = input.value;
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;
  //Here we are defining our city name and url with city name, unit and ApiKey
//-------------------------------------------------------------------------------
  
  const cityListItemsNode = document.querySelectorAll(".city");
  const cityListItems = Array.from(cityListItemsNode);
  if (cityListItems.length > 0) {
    const isAvailable = cityListItems.some(
      (card) =>
        card.querySelector(".name").innerText.toLowerCase() ==
        cityName.toLowerCase()
    );
    if (isAvailable) {
      msg.innerText = `You already know the weather for ${cityName.toUpperCase()}.`;
      clearMessage();
      form.reset();
      input.focus();
      return;
    }
  }
  //Here we are checking if the city name is already there(! but its just working correctly in English, must corrected!)

  try {
    // const rawResponse = await fetch(url);
    // const response = await rawResponse.json()
    loadingContainer.style.marginLeft = "10px";
    loadingContainer.style.display = "inline";
    const response = await axios.get(url);
    const { data } = response;
    const { name, main, sys, weather } = data;

    const createdCityCardLi = document.createElement("li");
    createdCityCardLi.classList.add("city");
    const createdCardInnerHTML = `
    <h2 class="city-name">
    <span class="name">${name}</span>
    <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
    <img src=${`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} alt="Weather image"/>
        <figcaption>${weather[0].description}</figcaption>
    </figure>
 
    `;
    createdCityCardLi.innerHTML = createdCardInnerHTML;
    list.appendChild(createdCityCardLi);
    // Here we re creating city cards by submiting:)
    //----------------------------------------------------------------
  } catch (error) {
    console.log("error", error);
    const code = error.response.data.cod;
    const errorMessage = error.response.data.message;
    msg.innerText = `An error happened: ${code} - ${errorMessage}`;
    clearMessage();
  }
//And here is the error part
//---------------------------------------------------------------------

  loadingContainer.style.display = "none";
});
//And here we have a Bootstrop loading spinner