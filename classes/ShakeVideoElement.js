class ShakeVideoElement extends HTMLVideoElement {
    #options;
    constructor(options = {
        autoStream: false
    }) {
        super();
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
}

//define custom element

customElements.define('shake-video-element', ShakeVideoElement);

export {
    ShakeVideoElement
}