import { ShakeVideoControls } from "./ShakeVideoControls";
class ShakeVideoElement extends HTMLElement {
    #shadow;
    #video;
    #playButton;
    #uploadButton;
    static observedAttributes = ["src"];
    constructor() {
        super();
        ShakeVideoControls.registerComponenet();
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
                "video/*": [".webm", ".mp4", ".mov", ".mpd"],
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
    }

    pip() {
        this.#video.requestPictureInPicture();
    }

    connectedCallback() {
        this.addEventListener('pip', () => {
            console.log('pip')
            this.pip()
        });

        this.#shadow = this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.id = 'shake-video-template';
        template.innerHTML = `
                    <div id="shake-video-container">
                        <slot name="header" class="header">
                            <h2>Shake Video</h2>
                            <p>Click the upload button to load a local video</p>
                        </slot>
                        <figure>
                            <video id="video" preload="metadata"></video>
                            <shake-video-controls></shake-video-controls>
                        </figure>
                        <div id="shake-video-actions">
                            <button class="shake-btn" id="upload-video">Upload Video</button>
                        </div>
                    </div>
                        
                    <style>
                    #shake-video-actions{
                        display: block;
                        text-align: center;
                    }

                    html,body {
                        margin:0;
                        padding:0;
                        width:100%;
                        height:100%;
                    }
                    body {
                        color:#333;
                        font-family:"Lucida Grande","Lucida Sans Unicode","DejaVu Sans",Lucida,Arial,Helvetica,sans-serif;
                    }
                    h1 {
                        color:#333;
                        font-size:20px;
                        font-size:1.25rem;
                    }
                    a {
                        color:#0095dd;
                        text-decoration:none;
                    }
                    a:hover, a:focus {
                        color:#2255aa;
                        text-decoration:underline;
                    }
                figure {
                    max-width:1024px;
                    width:100%;
                    height:100%;
                    max-height: 768px;
                    margin:20px auto;
                    margin:1.25rem auto;
                    padding:20px;
                    padding:1.051%;
                    background-color: #666;
                    opacity: 0.8;
                    border-radius: 1%;
                    box-shadow: 10px 5px 5px black;
                }
                figcaption {
                    display:block;
                    font-size:12px;
                    font-size:0.75rem;
                    color:#fff;
                }
                        .header {
                            text-align: center;
                        }
                        .shake-btn {
                            border-color: blue;
                            border-width: 3px;   
                        }

                        video {
                            width:100%;
                            border-radius: 2%;
                        }
                        /* hide controls on fullscreen with WebKit */
                figure[data-fullscreen=true] video::-webkit-media-controls {
                    display:none !important;
                }
                figure[data-fullscreen=true] {
                    max-width:100%;
                    width:100%;
                    margin:0;
                    padding:0;
                    max-height:100%;
                }
                figure[data-fullscreen=true] video {
                    height:auto;
                }
                figure[data-fullscreen=true] figcaption {
                    display:none;
                }
                figure[data-fullscreen=true] .controls {
                    position:absolute;
                    bottom:2%;
                    width:100%;
                    z-index:2147483647;
                }
                figure[data-fullscreen=true] .controls li {
                    width:5%;
                }
                figure[data-fullscreen=true] .controls .progress {
                    width:68%;
                }
                @media screen and (max-width:1024px) {
                    figure {
                        padding-left:0;
                        padding-right:0;
                        height:auto;
                    }
                }
                @media screen and (max-width:42.5em) {
                  
                    figcaption {
                        text-align:center;
                        margin-top:0.5rem;
                    }
                }
                    </style>
                    `;
                    
        let templateContent = template.content;
           
        this.#shadow.appendChild(templateContent.cloneNode(true));
        this.#video = this.#shadow.querySelector('video');
        this.#uploadButton = this.#shadow.getElementById('upload-video');
        this.#uploadButton.onclick = this.uploadVideo.bind(this);

    }
    
      disconnectedCallback() {
        console.log("Custom element removed from page.");
      }
    
      adoptedCallback() {
        console.log("Custom element moved to new page.");
      }
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'src': 
                this.#video.src = newValue;
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

    async setOutputAudio () {
        try{
        const audioDevice = await navigator.mediaDevices.selectAudioOutput();
        this.#video.setSinkId(audioDevice.deviceId);
        } catch (error) {
            console.log(error.message)
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