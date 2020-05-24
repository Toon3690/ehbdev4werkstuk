'use strict';

$(function () {

  //hide de filters wissen button
  $('.deleteButton').hide();

  //Maak arrays om bij te houden welke buttons actief zijn
  let genreActive = [];
  let doelgroepActive = [];
  //Een nieuwe array voor de actieve objecten
  let newData = [];


  //Laad de json in
  $.getJSON('entries.json', function (data) {

    console.log(data);
    //Plaats de video's in de html
    const makeDivs = (newData, i) => {


      //om makkelijk alle waardes te bereiken
      const item = newData[i];


      //Maak html elementen aan en stop deze in de div 'videoCard'
      let videoCard = document.createElement('div');
      videoCard.setAttribute('class', 'video-card');

      let link = document.createElement('a');
      link.setAttribute('href', item["link-to-video"].url);

      let videoCardImage = document.createElement('img');
      videoCardImage.setAttribute('class', 'video-card-image');
      videoCardImage.setAttribute('srcset', item.thumbnail.url);

      let genre = document.createElement('div');
      genre.innerText = item["genre-v2"];
      genre.setAttribute('class', 'genre tagline');

      let name = document.createElement('h3');
      name.setAttribute('class', 'name');
      name.innerText = item.name;


      videoCard.append(link);
      videoCard.append(videoCardImage);
      videoCard.append(genre);
      videoCard.append(name);

      //Zet de videoCard die nu alle html elementen heeft in de container
      $('.container').append(videoCard);
    }


    //For each functie om makkelijk een for loop uit te voeren op een meegegeven functie en array
    const forEach = (fn, newData) => {
      for (let i = 0; i < newData.length; i++) {
        fn(newData, i);
      }
    };

    //voer de remove functie uit als er op de deletebutton wordt gedrukt
    $('.deleteButton').click(function () {
      remove();
    });


    //Als button geklikt wordt...
    $('.tagline').click(function () {


      //Maak de container met de video's eerst leeg
      $('.container').html("");


      //Maak de arrays eerst leeg
      genreActive = [];
      doelgroepActive = [];
      newData = [];


      //Geef een active class mee aan deze button en show de filters wissen button
      $(this).toggleClass("active");
      $('.deleteButton').show();


      //Push de values van de buttons in een array als ze de active class bevatten om bij te houden welke filters aangeduid zijn
      $('.active.genre').each(function () {
        const val = ($(this).text());
        genreActive.push(val);
      })
      $('.active.doelgroep').each(function () {
        const val = ($(this).text());
        doelgroepActive.push(val);
      })


      //Als alle filters terug worden uitgezet roep dan remove terug aan
      if(doelgroepActive == "" && genreActive ==""){
        remove();
      }

      
      //Roep de updatearray aan
      updateArray();

      forEach(makeDivs, newData);

    });



    
    let updateArray = () => {
      //Loop door de items van data (de volledige array)
      for (let item of data.items) {
        //Kijk na of er in de arrays genreActive of doelgroepActive actieve filters zitten
        //Er zijn 4 verschillende gevallen wisselend tussen arrays met filters en arrays zonder filters of alletwee met of alletwee zonder
        //Push in de nieuwe array alle objecten die aan het bovenstaande voldoen
        if (genreActive.includes(item['genre-v2']) && doelgroepActive == '' || genreActive.includes(item['genre-v2']) && doelgroepActive.includes(item.category) || genreActive == '' && doelgroepActive == '' || genreActive == '' && doelgroepActive.includes(item.category)) {
          newData.push(item);
        };
      }
    }

    


    const remove = () => {

      //Hide de filters wissen button
      $('.deleteButton').hide();

      //clear alle arrays
      genreActive = [];
      doelgroepActive = [];
      newData = [];
      
      //Verwijder de active class van de filters en wis de container met alle video's
      $('.tagline').removeClass('active');
      $('.container').html("");

      //Maak de nieuwe array aan (Deze gaat dan met alle objecten zijn omdat er geen actieve filters zijn aangeduid)
      updateArray();

      //Zet de video's in de container dmv de nieuwe array
      forEach(makeDivs, newData);

    }


    //Laad de video's in de container als je de pagina opent
    updateArray();
    forEach(makeDivs, newData);


  });
});