window.onload = function() {
  const key = 'AIzaSyDHwWehFN66QEE8REGglR31oQEg1Q8pdCk';
  const playlistId = 'PLxQ30nUCB0uNCCKBD_JW1udM7iYH27cu2';
  const URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
  const maxResults = 50;
  const part = 'snippet';
  let nextPageToken = '';

  function loadVideos() {
    axios
      .get(
        `${URL}?part=${part}&maxResults=${maxResults}&playlistId=${playlistId}&key=${key}`
      )
      .then(res => {
        nextPageToken = res.data.nextPageToken;
        const id = res.data.items[0].snippet.resourceId.videoId;

        mainVideo(id);
        resultsLoop(res.data);
      });

    window.onscroll = function() {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight + 16
      ) {
        nextPageToken !== undefined &&
          new Promise(resolve => {
            document.getElementById('loader').style.display = 'flex';
            resolve(
              axios.get(
                `${URL}?part=${part}&maxResults=${maxResults}&playlistId=${playlistId}&key=${key}&pageToken=${nextPageToken}`
              )
            );
          }).then(res => {
            console.log(res);

            nextPageToken = res.data.nextPageToken;
            resultsLoop(res.data);
          });
      }
    };
  }

  function resultsLoop(data) {
    data.items.forEach(item => {
      const title = item.snippet.title;
      const description = item.snippet.description;
      const thumbnail = item.snippet.thumbnails.medium.url;
      const videoId = item.snippet.resourceId.videoId;

      document.getElementById('main').innerHTML += `
				<article class="item" data-key="${videoId}">
					<img src="${thumbnail}" alt="" class="thumb">
					<div class="details">
						<h4>${title}</h4>
						<p>${description}</p>
					</div>
				</article>
			`;
    });

    document.querySelectorAll('article').forEach(function(element) {
      element.addEventListener('click', function() {
        const id = element.getAttribute('data-key');
        mainVideo(id);
      });
    });
    document.getElementById('loader').style.display = 'none';
  }

  function mainVideo(id) {
    document.getElementById('video').innerHTML = `
		<iframe
			width="560"
			height="315"
			src="https://www.youtube.com/embed/${id}"
			frameborder="0" allow="autoplay;
			encrypted-media"
			allowfullscreen>
		</iframe>`;
  }

  loadVideos();
};
