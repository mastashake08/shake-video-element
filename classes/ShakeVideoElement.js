class ShakeVideoElement extends HTMLElement {
    #shadow;
    #video;
    #playButton;
    #pipButton;
    #dataButton;
    #uploadButton;
    static observedAttributes = ["src", "height", "width"];
    constructor() {
        super();  
    }

    getVideo() {
        return this.#shadow.querySelector('video');
    }

    async uploadVideo() {
        let fileHandle;

        const pickerOpts = {
            types: [
            {
                description: "Video",
                accept: {
                "video/*": [".webm", ".mp4", ".mov"],
                },
            },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
        };
        [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        const file = await fileHandle.getFile();
        const url = URL.createObjectURL(file);
        this.#video.src = url;
        this.#video.width = this.getAttribute('width') != null  ? this.getAttribute('width') : 680;
        this.#video.height = this.getAttribute('height') != null  ? this.getAttribute('height') : 420;
    }

    pip() {
        this.#video.requestPictureInPicture();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.id = 'shake-video-template';
        template.innerHTML = `
                    <div id="shake-video-container">
                        <slot title="header">
                            <h2>Shake Video</h2>
                        </slot>
                        <slot title="shake-video-controls">
                            <button id="shake-play-btn">Play</button>
                            <button id="shake-pip-btn">PIP</button>
                            <button id="shake-get-file-data">Get File Data</button>
                        </slot>
                        <button id="upload-video">Upload Video</button>
                    </div>
                        
                    <style>
                        button {
                        border-color: blue;
                        border-width: 3px;   
                        }
                    </style>
                    `;
                    
        let templateContent = template.content;
           
        this.#shadow.appendChild(templateContent.cloneNode(true));

        this.#video = document.createElement('video');
        this.#shadow.append(this.#video);
        this.#uploadButton = this.#shadow.getElementById('upload-video');
        this.#uploadButton.onclick = this.uploadVideo.bind(this);
        this.#dataButton = this.#shadow.querySelector('#shake-get-file-data');
        this.#dataButton.onclick = this.getFileData.bind(this);            
        this.#playButton = this.#shadow.querySelector('#shake-play-btn');
        this.#playButton.addEventListener('click',this.togglePlay.bind(this));
        this.#pipButton = this.#shadow.querySelector('#shake-pip-btn');
        this.#pipButton.addEventListener('click', this.pip.bind(this));
    }
    
      disconnectedCallback() {
        console.log("Custom element removed from page.");
      }
    
      adoptedCallback() {
        console.log("Custom element moved to new page.");
      }
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'height': 
                this.#video.height = newValue;
            case 'width':
                this.#video.width = newValue;
        }
      }

      togglePlay()  {
        if(!this.#video.paused) {
            this.#video.pause();
            this.#playButton.innerHTML = 'Play';
        } else {
            this.#video.play();
            this.#playButton.innerHTML = 'Pause';
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
        const data = {
            height: this.#video.videoHeight,
            width: this.#video.videoWidth,
            quality: this.#video.getVideoPlaybackQuality(),
            tracks: this.getTracks()
        };
        const event = new CustomEvent('shake-video-file-data', {
            data: data,
            bubbles: true
        });
        this.dispatchEvent(event);
        return data;
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