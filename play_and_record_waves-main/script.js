class Drumkit {
    constructor() {
        this.sounds = [];
        document.querySelectorAll('audio').forEach((el) => {
            this.sounds.push(el);
        });
        console.log(this.sounds);
        new DrumkitUI(this.sounds);
    }
}
const CHANNELS_COUNT = 4;
class DrumkitUI {
    constructor(sounds) {
        this.statsSection = document.getElementById('UI-section');
        this.channels = [[]];
        this.sounds = [];
        this.soundButtons = [];
        this.channelsDOMElements = [];
        this.activeChannel = null;
        // Sound mapping into class variable
        // Create event listener
        this.sounds = sounds.map((element) => ({
            element,
            key: element.dataset.key
        }));
        document.body.addEventListener('keypress', (ev) => this.onKeyDown(ev));
        this.renderButtons(sounds);
        this.createChannels();
    }
    renderButtons(sounds) {
        const container = document.getElementById('buttons');
        // Create buttons in DOM
        sounds.forEach(element => {
            const soundBtn = document.createElement('button');
            soundBtn.innerText = `${element.dataset.key}`;
            // Assign each button a key
            soundBtn.dataset.soundKey = element.dataset.key;
            // Separate each event for each button.
            soundBtn.addEventListener('click', (ev) => this.onClick(element.dataset.key, ev));
            // Save the button similat to the sound elements in the class.
            this.soundButtons.push(soundBtn);
            container.appendChild(soundBtn);
        });
    }
    // Define what happend on click
    onClick(key, ev) {
        const time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        this.playSound(key);
    }
    // Define what happend on holding key down
    onKeyDown(ev) {
        const key = ev.key;
        const time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        console.log(this.channels);
        this.playSound(key);
    }
    playSound(key = null) {
        // Do not play sound where there is none
        if (key) {
            const btn = this.soundButtons.find((el) => el.dataset.soundKey === key);
            const element = this.sounds.find((v) => v.key === key).element;
            element.currentTime = 0;
            element.play();
            this.giveAnimation(btn);
        }
    }
    // Animate during playing
    giveAnimation(btn) {
        const animSpan = document.createElement('span');
        btn.classList.add("playing");
        btn.appendChild(animSpan);
        setTimeout(() => {
            btn.classList.remove("playing");
        }, 100);
        animSpan.addEventListener('animationend', () => {
            animSpan.remove();
        });
    }
    createChannels() {
        const container = document.getElementById('channels');
        for (let i = 0; i < CHANNELS_COUNT; i++) {
            const channelContainer = document.createElement('div');
            channelContainer.classList.add("channelContainer");
            // Record buttons
            const recordBtn = document.createElement('button');
            recordBtn.className = `recordBtn`;
            recordBtn.addEventListener('click', (ev) => this.activateChannel(i, ev));
            channelContainer.appendChild(recordBtn);
            // Play buttons
            const playBtn = document.createElement('button');
            playBtn.className = `playBtn`;
            playBtn.disabled = true;
            const s = playBtn.addEventListener('click', (ev) => this.onPlayStopChannel(i));
            channelContainer.appendChild(playBtn);
            // Record progress bar 
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = `progressBar`;
            const progressBar = document.createElement('span');
            progressBar.addEventListener('animationend', () => {
                progressBar.style.animation = null;
                this.channelsDOMElements[i].playBtn.disabled = false;
            });
            progressBarContainer.appendChild(progressBar);
            channelContainer.appendChild(progressBarContainer);
            this.channelsDOMElements.push({
                playBtn,
                recordBtn,
                progressBar
            });
            container.appendChild(channelContainer);
        }
    }
    activateChannel(channelIndex, event) {
        // The click event control recording time
        this.channels[channelIndex] = [{
            time: event.timeStamp,
            key: null
        }];
        this.activeChannel = channelIndex;
        this.channelsDOMElements.forEach(el => {
            el.recordBtn.disabled = true;
        });
        this.channelsDOMElements[channelIndex].playBtn.disabled = false;
        this.channelsDOMElements[channelIndex].playBtn.classList.add('stopBtn');
    }
    onPlayStopChannel(channelIndex) {
        if (this.activeChannel === channelIndex) {
            this.stopRecording(channelIndex);
        }
        else {
            // Play the sounds
            const channel = this.channels[channelIndex];
            let prevTime = channel[0].time;
            this.initPlayingBehavior(channelIndex);
            channel.forEach((sound) => {
                const time = sound.time - prevTime;
                setTimeout(() => {
                    this.playSound(sound.key);
                }, time);
            });
        }
    }
    stopRecording(channelIndex) {
        this.channelsDOMElements[channelIndex].playBtn.classList.remove('stopBtn');
        const channel = this.channels[channelIndex];
        const recordingTime = channel[channel.length - 1].time - channel[0].time;
        this.channelsDOMElements[channelIndex].progressBar.parentElement.querySelectorAll('time').forEach(v => v.remove());
        this.channelsDOMElements.forEach(el => {
            el.recordBtn.disabled = false;
        });
        if (recordingTime) {
            channel.forEach((sound) => {
                const timeMoment = document.createElement('time');
                const percentageTime = (sound.time - channel[0].time) / recordingTime * 100;
                console.log(percentageTime);
                timeMoment.className = "timeMoment";
                timeMoment.style.left = `${percentageTime}%`;
                this.channelsDOMElements[channelIndex].progressBar.parentElement.appendChild(timeMoment);
            });
        }
        else {
            this.channelsDOMElements[channelIndex].playBtn.disabled = true;
        }
        this.activeChannel = null;
    }
    initPlayingBehavior(channelIndex) {
        this.channelsDOMElements[channelIndex].playBtn.disabled = true;
        // Create animation for the progress bar
        const channel = this.channels[channelIndex];
        let prevTime = channel[0].time;
        const recordingTime = `${(channel[channel.length - 1].time - prevTime).toFixed()}ms`;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = ``;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = `progressBarAnim ${recordingTime} forwards linear`;
    }
}
const drumkit = new Drumkit();
