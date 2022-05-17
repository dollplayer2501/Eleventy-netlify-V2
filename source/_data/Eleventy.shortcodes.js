//
//
//

module.exports = {
    //
    youtubeEmbed: function (id) {
        return `<iframe class="youtube"
            width="400" height="225"
            src="https://www.youtube.com/embed/${id}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowfullscreen>
          </iframe>`;
    },
    //
    nicovideoEmbed: function (id, comment) {
        return `<span class="nicovideo">
            <script type="application/javascript" src="https://embed.nicovideo.jp/watch/${id}/script?w=400&h=225"></script>
            <noscript><a href="https://www.nicovideo.jp/watch/${id}">${comment}</a></noscript>
          </span>`;
    }
};
