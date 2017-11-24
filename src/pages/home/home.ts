import { Component } from '@angular/core';

const MAX_SCALE = 2.1;
const MIN_SCALE = 0.9;
const BASE_SCALE = 1.5;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public fontSize = `${BASE_SCALE}rem`;

  private scale = BASE_SCALE;
  private alreadyScaled = BASE_SCALE;

  private isScaling = false;


  constructor() { }

  public onPinchStart(e) {

    // flag that sets the class to disable scrolling
    this.isScaling = true;
  }


  // called at (pinchend) and (pinchcancel)
  public onPinchEnd(e) {

    // flip the flag, enable scrolling
    this.isScaling = false;

    // adjust the amount we already scaled
    this.alreadyScaled = this.scale * this.alreadyScaled;

  }

  public onPinchMove(e) {

    // set the scale so we can track it globally
    this.scale = e.scale;

    // total amount we scaled
    let totalScaled = this.alreadyScaled * e.scale;

    // did we hit the max scale (pinch out)
    if (totalScaled >= MAX_SCALE) {

      // fix the scale by calculating it, don't use the e.scale
      // scenario: an insane quick pinch out will offset the this.scale
      this.scale = MAX_SCALE / this.alreadyScaled;
      totalScaled = MAX_SCALE;

      // did we hit the min scale (pinch in)
    } else if (totalScaled <= MIN_SCALE) {

      // fix the scale
      this.scale = MIN_SCALE / this.alreadyScaled;
      totalScaled = MIN_SCALE;

    }

    let fontSize = Math.round(totalScaled * 10) / 10;

    // change the fontsize every 3 decimals in scale change
    if ((fontSize * 10) % 3 === 0) {

      // update the fontsize
      this.fontSize = `${fontSize}rem`;
    }

  }

}