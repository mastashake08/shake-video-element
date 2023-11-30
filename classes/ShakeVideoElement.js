class ShakeVideoElement extends HTMLElement {
    #options;
    #shadow;
    #video;
    #template;
    static observedAttributes = ["src"];
    constructor(options = {
        autoStream: false,
        src: 'https://commons.wikimedia.org/wiki/File:Big_Buck_Bunny_4K.webm'
    }) {
        super();
        this.#options = options;
        this.#shadow = this.attachShadow({ mode: 'open' });
    }

    getVideo() {
        return this.#video;
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        console.log(
          `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
        );
        switch (name) {
            case 'src':
                if(this.#video == null) {
                    const res = await fetch('/templates/main.html')
                    const parser = new DOMParser();
                    const body = await res.text();
                    const template = parser.parseFromString(body, "text/html");
                    this.#template = template;

                    console.log([body, this.#template]);
                    this.#video = this.#template.getElementById('shake-video');
                    this.#video.src = this.#options.src;
                    
                    div.append(this.#video);
                    this.#shadow.append(div);
                    console.log(div);
                    // if(this.#options.autoStream || this.getAttribute('autoStream') == true) {
                    //     this.playAndStream();
                    // }      
            }
                this.#video.src = newValue;
            case 'autoStream':
                if(newValue == true) {
                    this.playAndStream()
                }
        }
      }
    /*
     * 
     * @returns returns an object cpntaining all the tracks of the video
     */
    getTracks() {
        return {
            textTracks: this.#video.textTracks,
            audioTracks: this.#video.audioTracks,
            videoTracks: this.#video.videoTracks
        }
    }

    /**
     * 
     * @returns An object with a heigh, width, and quality object
     */
    getFileData() {
        return {
            height: this.#video.videoHeight,
            width: this.#video.videoWidth,
            quality: this.#video.getVideoPlaybackQuality()
        }
    }

    /**
     * 
     * @returns A new MediaStream from the current tracks
     */

    createMediaStream() {
        const {
            textTracks, 
            audioTracks, 
            videoTracks
            } = this.getTracks();
        return new MediaStream([textTracks,audioTracks,videoTracks]);    

    }

    /**
     * 
     * @returns The stream object
     */
    playAndStream() {
        try {
            const stream = this.#video.captureStream();
            this.#video.play();
            return stream;
        } catch (error) {
            alert('There was an error capturing the stream')
        }
    }

    /**
     * 
     * @param {*} id - ID of text track to toggle
     */
    toggleTextTrack(id) {
        const {textTracks} = this.getTracks();
        const track = textTracks[id];
        switch(track.mode) {
            case 'showing':
                track.mode = 'hidden';

            case 'hidden':
                track.mode = 'showing';
        }
    }
}

export {
    ShakeVideoElement
}