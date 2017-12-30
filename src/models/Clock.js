import { Atom } from 'mobx';

export default class Clock {
  get now () {
    if (this._atom.reportObserved()) {
      return this._now;
    } else {
      return Date.now();
    }
  }

  _atom = new Atom('Clock', () => this._start(), () => this._stop());

  _start () {
    clearInterval(this._timer);
    this._tick();
    this._timer = setInterval(() => this._tick(), 1000);
  }

  _stop () {
    clearInterval(this._timer);
  }

  _tick () {
    this._now = Date.now();
    this._atom.reportChanged();
  }
}
