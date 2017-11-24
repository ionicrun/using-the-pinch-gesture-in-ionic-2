import { Directive, HostListener, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';

@Directive({
  selector: '[pinch]'
})

export class PinchDirective implements AfterViewInit, OnDestroy {
  
  // flag that is set when 2 fingers touch the screen
  private isPinching = false;

  // initial scale no need to change
  private scale = 1;

  // store the initial distance between the fingers
  // so we can calculate with it
  private initalDistance;

  // used to store the Observable created from the touchmove event
  // so we can unsubscribe from it when ngDestroy is called
  private touchMove;

  constructor(

    // the actual element
    private el: ElementRef

  ) { }

  public ngAfterViewInit() {

    // start Observing the touchmove event
    this.touchMove = Observable
      .fromEvent(this.el.nativeElement, 'touchmove')
      // since both fingers trigger a move event, broadcast only
      // a new scale what it actually changed
      .distinctUntilChanged()
      .subscribe((event) => {

        // call the onTouchMove
        this.onTouchMove(event);

      });

  }

  // extend the outputs to your needs, for now we just use
  // the defaults, like move, start and end
  @Output()
  public pinchmove: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public pinchstart: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public pinchend: EventEmitter<any> = new EventEmitter<any>();


  @HostListener('touchstart', ['$event'])
  public onTouchStart(e) {

    // set the flag to true, only if 2 fingers touch te screen
    if (e.touches.length === 2) {

      // emit the touchStart event
      this.pinchstart.emit(e);

      this.isPinching = true;

    }
  }


  @HostListener('touchend', ['$event'])
  public onTouchEnd(e) {

    if (this.isPinching) {

      // reset the initial distance
      this.initalDistance = undefined;

      // we are not scaling anymore
      this.isPinching = false;

      this.pinchend.emit(e);

    }
  }


  private onTouchMove(e) {

    // are we pinching?
    if (this.isPinching) {

      // calculate the initial distance if not set
      if (!this.initalDistance) {
        this.initalDistance = this.getDistance(e);
      }

      // round the scale to 2 decimals, so the distinctUntilChanged
      // can do its work properly
      this.scale = Math.round(this.getScale(e) * 100) / 100;

      // emit the scale!
      this.pinchmove.emit({ scale: this.scale });

    }
  }


  // calculate the scale
  private getScale(e) {
    return this.getDistance(e) / this.initalDistance;
  }


  // just some basic math to calculate the distance between two points
  private getDistance(e) {

    let touch0 = e.touches[0];
    let touch1 = e.touches[1];

    return Math.sqrt(
      (touch0.pageX - touch1.pageX) * (touch0.pageX - touch1.pageX) +
      (touch0.pageY - touch1.pageY) * (touch0.pageY - touch1.pageY)
    );

  }


  // clean things up
  public ngOnDestroy() {
    this.touchMove.unsubscribe();
  }

}