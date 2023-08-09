  const apiAddress = 'http://localhost:3000/beers';

  let currentDisplayedBeerId = 1;

  document.addEventListener('DOMContentLoaded', function() {
      const beerList = document.getElementById('beer-list');
      const beerNameElement = document.getElementById('beer-name');
      const beerImageElement = document.getElementById('beer-image');
      const beerDescriptionElement = document.getElementById('beer-description');
      const reviewList = document.getElementById('review-list');
      beerList.innerHTML = '';

      fetch(apiAddress)
          .then((response) => response.json())
          .then(function(beers) {
              beers.forEach(function(beer) {
                  const li = document.createElement('li');
                  li.textContent = beer.name;

                  li.addEventListener('click', function() {
                      fetch(`${apiAddress}/${beer.id}`)
                          .then((response) => response.json())
                          .then(function(beerData) {
                              beerNameElement.textContent = beerData.name;
                              beerImageElement.src = beerData.image_url;
                              beerDescriptionElement.textContent = beerData.description;
                              reviewList.innerHTML = '';
                              beerData.reviews.forEach(function(review) {
                                  const li = document.createElement('li');
                                  li.textContent = review;
                                  reviewList.appendChild(li);
                              });
                          })
                          .catch((error) => (error));

                      currentDisplayedBeerId = beer.id;
                  });
                  beerList.appendChild(li);
              });
          })
          .catch((error) => (error));

      reviewList.addEventListener('click', (event) => {
          if (event.target.tagName === 'LI') {
              event.target.remove();
          }
      });


      fetch(`${apiAddress}/${currentDisplayedBeerId}`)
          .then((response) => response.json())
          .then(function(beerData) {
              beerNameElement.textContent = beerData.name;
              beerImageElement.src = beerData.image_url;
              beerDescriptionElement.textContent = beerData.description;

              const reviewForm = document.getElementById('review-form')

              reviewForm.addEventListener('submit', function(event) {
                  event.preventDefault();
                  const reviewTextarea = document.getElementById('review');
                  const newReview = reviewTextarea.value;
                  const reviewList = document.getElementById('review-list');
                  const li = document.createElement('li');
                  li.textContent = newReview;
                  reviewList.appendChild(li);
                  reviewTextarea.value = '';
                  const beerId = currentDisplayedBeerId;
                  const reviewData = { review: newReview };

                  fetch(`${apiAddress}/${beerId}/reviews`, {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(reviewData)
                      })
                      .then((response) => response.json())
                      .then((responseData) => (responseData))
                      .catch((error) => (error));
              });
              reviewList.innerHTML = '';
              beerData.reviews.forEach(function(review) {
                  const li = document.createElement('li');
                  li.textContent = review;
                  reviewList.appendChild(li);
              });
          })
          .catch((error) => (error));
  });