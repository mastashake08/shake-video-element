class ShakeVideoElement extends HTMLVideoElement {
    #options;
    #shadow;
    constructor(options = {
        autoStream: false
    }) {
        super();
        
        this.#shadow = this.parentElement.attachShadow({ mode: 'open' });
        this.#options = options;
        if(this.#options.autoStream) {
            this.playAndStream();
        }
    }

    /**
     * 
     * @returns returns an object cpntaining all the tracks of the video
     */
    getTracks() {
        return {
            textTracks: this.textTracks,
            audioTracks: this.audioTracks,
            videoTracks: this.videoTracks
        }
    }

    /**
     * 
     * @returns An object with a heigh, width, and quality object
     */
    getFileData() {
        return {
            height: this.videoHeight,
            width: this.videoWidth,
            quality: this.getVideoPlaybackQuality()
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
            const stream = this.captureStream();
            this.play();
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

//define custom element

customElements.define('shake-video-element', ShakeVideoElement, {
    extends: 'video'
});

export {
    ShakeVideoElement
}