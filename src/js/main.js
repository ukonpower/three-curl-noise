import $ from 'jquery';
import MainScene from './graphics/scenes/MainScene';
import ThreeGraphic from './graphics/utils/ThreeGraphic';

window.$ = $;
class App {

    constructor() {
        this.init();
    }

    init() {
        $(window).on('touchmove.noScroll', function(e) {
        e.preventDefault();
        });
        this.threeGraphic = new ThreeGraphic();
        this.threeGraphic.setScene(new MainScene(this.threeGraphic.renderer));
    }
}

$(document).ready(() => new App());