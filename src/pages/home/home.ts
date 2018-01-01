import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import {NativeAudio} from '@ionic-native/native-audio';

import {slideImage} from './articles';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild(Slides) slides: Slides;
    autoPlay: boolean = false;
    dubPlay: boolean = false;
    imageList: any;

    constructor(public navCtrl: NavController,
                private nativeAudio: NativeAudio) {
        this.imageList = slideImage;

        // Register The Sound
        if (this.imageList.length > 0) {
            this.imageList.forEach((val, idx) => {
                if (val.sound !== null) {
                    this.nativeAudio.preloadSimple('audio-' + val.sound, 'assets/sound/' + val.sound).then(() => {
                        console.log('Audio Created');
                    })
                }
            });
        }
    }

    slideAutoPlay() {
        this.slides.loop = false;
        this.slides.autoplay = 3000;

        if (!this.autoPlay) {
            this.slides.startAutoplay();
        } else {
            this.slides.stopAutoplay();
        }
        this.autoPlay = !this.autoPlay;
    }

    onSlideChanged(event) {
        if (this.autoPlay && this.slides.isEnd()) {
            this.autoPlay = false;
            this.slides.stopAutoplay();
        }

        if (this.dubPlay) {
            this.imageList.forEach((val, idx) => {
                if (val.sound !== null) {
                    this.nativeAudio.stop('audio-' + val.sound).then(() => {
                        console.log('Audio Stop');
                    });
                }
            });

            this.dubPlay = false;
        }
    }

    slideEvent(event) {
        if (event === 'next') {
            this.slides.slideNext();
        } else if (event === 'end') {
            this.slides.slideTo(this.slides.length());
        } else if (event === 'prev') {
            this.slides.slidePrev();
        } else if (event === 'start') {
            this.slides.slideTo(0);
        }
    }

    generateDub() {
        let page = this.slides.getActiveIndex();
        let obj = this.imageList[page];

        if (typeof obj !== 'undefined') {
            if (obj.sound !== null) {
                if (!this.dubPlay) {
                    this.nativeAudio.play('audio-' + obj.sound).then(() => console.log('Audio Play'));
                } else {
                    this.nativeAudio.stop('audio-' + obj.sound).then(() => console.log('Audio Stop'));
                }
                this.dubPlay = !this.dubPlay;
            }
        }
    }
}
