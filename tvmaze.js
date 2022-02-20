/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  const showInfo = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`)
  return showInfo.data;

}





/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    // ??????THE FOLLOWING THROWS AN ERROR IF I USE LET OR CONST WITHIN THE TRY BLOCK
    try {
      showImage = show.show.image.medium
    } catch {
      showImage = "https://tinyurl.com/tv-missing";
    }

    let $itemWithImage = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
      <div class="card" data-show-id="${show.show.id}">
         <img class="card-img-top" src="${showImage}">
           <div class="card-body">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
           </div>
         </div>
          <button id=${show.show.id}>Episodes</button>
         </div>
         `);

    // let $itemWithoutImage = $(
    //   `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
    //        <div class="card" data-show-id="${show.show.id}">
    //        <img class="card-img-top" src="https://tinyurl.com/tv-missing">
    //          <div class="card-body">
    //            <h5 class="card-title">${show.show.name}</h5>
    //            <p class="card-text">${show.show.summary}</p>
    //          </div>
    //        </div>
    //      </div>
    //     `);
    // ?????? STILL NEEDS EFFECTIVE ERROR HANDLING FOR ABSENT IMAGES
    // try {
    $showsList.append($itemWithImage);

    //   // $('<button>Episodes</button>').appendTo(`#${show.show.id}`)
    // } catch (error) {
    //   $showsList.append($itemWithoutImage);

    // }

    $(`button#${show.show.id}`).on('click', async function () {
      const episodes = await getEpisodes(show.show.id);
      populateEpisodes(episodes, show.show.name);
    })

  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const showEpisodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return showEpisodes.data;

  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodes(episodes, showName) {
  const episodesUl = $('ul');
  episodesUl.append(`<li><b>${showName}</b></li>`)
  for (let episode of episodes) {
    episodesUl.append(`<li>Season ${episode.season} episode ${episode.number}, ${episode.name}</li>`)
  }
  episodesUl.appendTo()
  $("#episodes-area").show();

}
