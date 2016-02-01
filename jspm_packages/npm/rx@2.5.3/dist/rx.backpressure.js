/* */ 
"format cjs";
;
(function(factory) {
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };
  var root = (objectTypes[typeof window] && window) || this,
      freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
      freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
      moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
      freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }
  if (typeof define === 'function' && define.amd) {
    define(['rx'], function(Rx, exports) {
      return factory(root, exports, Rx);
    });
  } else if (typeof module === 'object' && module && module.exports === freeExports) {
    module.exports = factory(root, module.exports, require('./rx'));
  } else {
    root.Rx = factory(root, {}, root.Rx);
  }
}.call(this, function(root, exp, Rx, undefined) {
  var Observable = Rx.Observable,
      observableProto = Observable.prototype,
      AnonymousObservable = Rx.AnonymousObservable,
      AbstractObserver = Rx.internals.AbstractObserver,
      CompositeDisposable = Rx.CompositeDisposable,
      Notification = Rx.Notification,
      Subject = Rx.Subject,
      Observer = Rx.Observer,
      disposableEmpty = Rx.Disposable.empty,
      disposableCreate = Rx.Disposable.create,
      inherits = Rx.internals.inherits,
      addProperties = Rx.internals.addProperties,
      timeoutScheduler = Rx.Scheduler.timeout,
      currentThreadScheduler = Rx.Scheduler.currentThread,
      identity = Rx.helpers.identity,
      isScheduler = Rx.Scheduler.isScheduler,
      isFunction = Rx.helpers.isFunction,
      checkDisposed = Rx.Disposable.checkDisposed;
  var errorObj = {e: {}};
  var tryCatchTarget;
  function tryCatcher() {
    try {
      return tryCatchTarget.apply(this, arguments);
    } catch (e) {
      errorObj.e = e;
      return errorObj;
    }
  }
  function tryCatch(fn) {
    if (!isFunction(fn)) {
      throw new TypeError('fn must be a function');
    }
    tryCatchTarget = fn;
    return tryCatcher;
  }
  function thrower(e) {
    throw e;
  }
  Rx.Pauser = (function(__super__) {
    inherits(Pauser, __super__);
    function Pauser() {
      __super__.call(this);
    }
    Pauser.prototype.pause = function() {
      this.onNext(false);
    };
    Pauser.prototype.resume = function() {
      this.onNext(true);
    };
    return Pauser;
  }(Subject));
  var PausableObservable = (function(__super__) {
    inherits(PausableObservable, __super__);
    function subscribe(observer) {
      var conn = this.source.publish(),
          subscription = conn.subscribe(observer),
          connection = disposableEmpty;
      var pausable = this.pauser.distinctUntilChanged().subscribe(function(b) {
        if (b) {
          connection = conn.connect();
        } else {
          connection.dispose();
          connection = disposableEmpty;
        }
      });
      return new CompositeDisposable(subscription, connection, pausable);
    }
    function PausableObservable(source, pauser) {
      this.source = source;
      this.controller = new Subject();
      if (pauser && pauser.subscribe) {
        this.pauser = this.controller.merge(pauser);
      } else {
        this.pauser = this.controller;
      }
      __super__.call(this, subscribe, source);
    }
    PausableObservable.prototype.pause = function() {
      this.controller.onNext(false);
    };
    PausableObservable.prototype.resume = function() {
      this.controller.onNext(true);
    };
    return PausableObservable;
  }(Observable));
  observableProto.pausable = function(pauser) {
    return new PausableObservable(this, pauser);
  };
  function combineLatestSource(source, subject, resultSelector) {
    return new AnonymousObservable(function(o) {
      var hasValue = [false, false],
          hasValueAll = false,
          isDone = false,
          values = new Array(2),
          err;
      function next(x, i) {
        values[i] = x;
        hasValue[i] = true;
        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
          if (err) {
            return o.onError(err);
          }
          var res = tryCatch(resultSelector).apply(null, values);
          if (res === errorObj) {
            return o.onError(res.e);
          }
          o.onNext(res);
        }
        isDone && values[1] && o.onCompleted();
      }
      return new CompositeDisposable(source.subscribe(function(x) {
        next(x, 0);
      }, function(e) {
        if (values[1]) {
          o.onError(e);
        } else {
          err = e;
        }
      }, function() {
        isDone = true;
        values[1] && o.onCompleted();
      }), subject.subscribe(function(x) {
        next(x, 1);
      }, function(e) {
        o.onError(e);
      }, function() {
        isDone = true;
        next(true, 1);
      }));
    }, source);
  }
  var PausableBufferedObservable = (function(__super__) {
    inherits(PausableBufferedObservable, __super__);
    function subscribe(o) {
      var q = [],
          previousShouldFire;
      function drainQueue() {
        while (q.length > 0) {
          o.onNext(q.shift());
        }
      }
      var subscription = combineLatestSource(this.source, this.pauser.distinctUntilChanged().startWith(false), function(data, shouldFire) {
        return {
          data: data,
          shouldFire: shouldFire
        };
      }).subscribe(function(results) {
        if (previousShouldFire !== undefined && results.shouldFire != previousShouldFire) {
          previousShouldFire = results.shouldFire;
          if (results.shouldFire) {
            drainQueue();
          }
        } else {
          previousShouldFire = results.shouldFire;
          if (results.shouldFire) {
            o.onNext(results.data);
          } else {
            q.push(results.data);
          }
        }
      }, function(err) {
        drainQueue();
        o.onError(err);
      }, function() {
        drainQueue();
        o.onCompleted();
      });
      return subscription;
    }
    function PausableBufferedObservable(source, pauser) {
      this.source = source;
      this.controller = new Subject();
      if (pauser && pauser.subscribe) {
        this.pauser = this.controller.merge(pauser);
      } else {
        this.pauser = this.controller;
      }
      __super__.call(this, subscribe, source);
    }
    PausableBufferedObservable.prototype.pause = function() {
      this.controller.onNext(false);
    };
    PausableBufferedObservable.prototype.resume = function() {
      this.controller.onNext(true);
    };
    return PausableBufferedObservable;
  }(Observable));
  observableProto.pausableBuffered = function(subject) {
    return new PausableBufferedObservable(this, subject);
  };
  var ControlledObservable = (function(__super__) {
    inherits(ControlledObservable, __super__);
    function subscribe(observer) {
      return this.source.subscribe(observer);
    }
    function ControlledObservable(source, enableQueue, scheduler) {
      __super__.call(this, subscribe, source);
      this.subject = new ControlledSubject(enableQueue, scheduler);
      this.source = source.multicast(this.subject).refCount();
    }
    ControlledObservable.prototype.request = function(numberOfItems) {
      return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
    };
    return ControlledObservable;
  }(Observable));
  var ControlledSubject = (function(__super__) {
    function subscribe(observer) {
      return this.subject.subscribe(observer);
    }
    inherits(ControlledSubject, __super__);
    function ControlledSubject(enableQueue, scheduler) {
      enableQueue == null && (enableQueue = true);
      __super__.call(this, subscribe);
      this.subject = new Subject();
      this.enableQueue = enableQueue;
      this.queue = enableQueue ? [] : null;
      this.requestedCount = 0;
      this.requestedDisposable = disposableEmpty;
      this.error = null;
      this.hasFailed = false;
      this.hasCompleted = false;
      this.scheduler = scheduler || currentThreadScheduler;
    }
    addProperties(ControlledSubject.prototype, Observer, {
      onCompleted: function() {
        this.hasCompleted = true;
        if (!this.enableQueue || this.queue.length === 0) {
          this.subject.onCompleted();
        } else {
          this.queue.push(Notification.createOnCompleted());
        }
      },
      onError: function(error) {
        this.hasFailed = true;
        this.error = error;
        if (!this.enableQueue || this.queue.length === 0) {
          this.subject.onError(error);
        } else {
          this.queue.push(Notification.createOnError(error));
        }
      },
      onNext: function(value) {
        var hasRequested = false;
        if (this.requestedCount === 0) {
          this.enableQueue && this.queue.push(Notification.createOnNext(value));
        } else {
          (this.requestedCount !== -1 && this.requestedCount-- === 0) && this.disposeCurrentRequest();
          hasRequested = true;
        }
        hasRequested && this.subject.onNext(value);
      },
      _processRequest: function(numberOfItems) {
        if (this.enableQueue) {
          while ((this.queue.length >= numberOfItems && numberOfItems > 0) || (this.queue.length > 0 && this.queue[0].kind !== 'N')) {
            var first = this.queue.shift();
            first.accept(this.subject);
            if (first.kind === 'N') {
              numberOfItems--;
            } else {
              this.disposeCurrentRequest();
              this.queue = [];
            }
          }
          return {
            numberOfItems: numberOfItems,
            returnValue: this.queue.length !== 0
          };
        }
        return {
          numberOfItems: numberOfItems,
          returnValue: false
        };
      },
      request: function(number) {
        this.disposeCurrentRequest();
        var self = this;
        this.requestedDisposable = this.scheduler.scheduleWithState(number, function(s, i) {
          var r = self._processRequest(i),
              remaining = r.numberOfItems;
          if (!r.returnValue) {
            self.requestedCount = remaining;
            self.requestedDisposable = disposableCreate(function() {
              self.requestedCount = 0;
            });
          }
        });
        return this.requestedDisposable;
      },
      disposeCurrentRequest: function() {
        this.requestedDisposable.dispose();
        this.requestedDisposable = disposableEmpty;
      }
    });
    return ControlledSubject;
  }(Observable));
  observableProto.controlled = function(enableQueue, scheduler) {
    if (enableQueue && isScheduler(enableQueue)) {
      scheduler = enableQueue;
      enableQueue = true;
    }
    if (enableQueue == null) {
      enableQueue = true;
    }
    return new ControlledObservable(this, enableQueue, scheduler);
  };
  var StopAndWaitObservable = (function(__super__) {
    function subscribe(observer) {
      this.subscription = this.source.subscribe(new StopAndWaitObserver(observer, this, this.subscription));
      var self = this;
      timeoutScheduler.schedule(function() {
        self.source.request(1);
      });
      return this.subscription;
    }
    inherits(StopAndWaitObservable, __super__);
    function StopAndWaitObservable(source) {
      __super__.call(this, subscribe, source);
      this.source = source;
    }
    var StopAndWaitObserver = (function(__sub__) {
      inherits(StopAndWaitObserver, __sub__);
      function StopAndWaitObserver(observer, observable, cancel) {
        __sub__.call(this);
        this.observer = observer;
        this.observable = observable;
        this.cancel = cancel;
      }
      var stopAndWaitObserverProto = StopAndWaitObserver.prototype;
      stopAndWaitObserverProto.completed = function() {
        this.observer.onCompleted();
        this.dispose();
      };
      stopAndWaitObserverProto.error = function(error) {
        this.observer.onError(error);
        this.dispose();
      };
      stopAndWaitObserverProto.next = function(value) {
        this.observer.onNext(value);
        var self = this;
        timeoutScheduler.schedule(function() {
          self.observable.source.request(1);
        });
      };
      stopAndWaitObserverProto.dispose = function() {
        this.observer = null;
        if (this.cancel) {
          this.cancel.dispose();
          this.cancel = null;
        }
        __sub__.prototype.dispose.call(this);
      };
      return StopAndWaitObserver;
    }(AbstractObserver));
    return StopAndWaitObservable;
  }(Observable));
  ControlledObservable.prototype.stopAndWait = function() {
    return new StopAndWaitObservable(this);
  };
  var WindowedObservable = (function(__super__) {
    function subscribe(observer) {
      this.subscription = this.source.subscribe(new WindowedObserver(observer, this, this.subscription));
      var self = this;
      timeoutScheduler.schedule(function() {
        self.source.request(self.windowSize);
      });
      return this.subscription;
    }
    inherits(WindowedObservable, __super__);
    function WindowedObservable(source, windowSize) {
      __super__.call(this, subscribe, source);
      this.source = source;
      this.windowSize = windowSize;
    }
    var WindowedObserver = (function(__sub__) {
      inherits(WindowedObserver, __sub__);
      function WindowedObserver(observer, observable, cancel) {
        this.observer = observer;
        this.observable = observable;
        this.cancel = cancel;
        this.received = 0;
      }
      var windowedObserverPrototype = WindowedObserver.prototype;
      windowedObserverPrototype.completed = function() {
        this.observer.onCompleted();
        this.dispose();
      };
      windowedObserverPrototype.error = function(error) {
        this.observer.onError(error);
        this.dispose();
      };
      windowedObserverPrototype.next = function(value) {
        this.observer.onNext(value);
        this.received = ++this.received % this.observable.windowSize;
        if (this.received === 0) {
          var self = this;
          timeoutScheduler.schedule(function() {
            self.observable.source.request(self.observable.windowSize);
          });
        }
      };
      windowedObserverPrototype.dispose = function() {
        this.observer = null;
        if (this.cancel) {
          this.cancel.dispose();
          this.cancel = null;
        }
        __sub__.prototype.dispose.call(this);
      };
      return WindowedObserver;
    }(AbstractObserver));
    return WindowedObservable;
  }(Observable));
  ControlledObservable.prototype.windowed = function(windowSize) {
    return new WindowedObservable(this, windowSize);
  };
  return Rx;
}));
