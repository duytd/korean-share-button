!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ShareButton=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.array.iterator');
module.exports = _dereq_('../../modules/$.core').Array.values;
},{"../../modules/$.core":8,"../../modules/es6.array.iterator":35}],2:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.math.trunc');
module.exports = _dereq_('../../modules/$.core').Math.trunc;
},{"../../modules/$.core":8,"../../modules/es6.math.trunc":36}],3:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.symbol');
_dereq_('../../modules/es6.object.to-string');
module.exports = _dereq_('../../modules/$.core').Symbol;
},{"../../modules/$.core":8,"../../modules/es6.object.to-string":37,"../../modules/es6.symbol":38}],4:[function(_dereq_,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _dereq_('./$.wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)_dereq_('./$.hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./$.hide":17,"./$.wks":34}],5:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":20}],6:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./$.cof')
  , TAG = _dereq_('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":7,"./$.wks":34}],7:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],8:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.5'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],9:[function(_dereq_,module,exports){
var global     = _dereq_('./$.global')
  , core       = _dereq_('./$.core')
  , hide       = _dereq_('./$.hide')
  , $redef     = _dereq_('./$.redef')
  , PROTOTYPE  = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)$redef(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":8,"./$.global":15,"./$.hide":17,"./$.redef":29}],10:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],11:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":13}],12:[function(_dereq_,module,exports){
// all enumerable object keys, includes symbols
var $ = _dereq_('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":25}],13:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],14:[function(_dereq_,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = _dereq_('./$.to-iobject')
  , getNames  = _dereq_('./$').getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":25,"./$.to-iobject":32}],15:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],16:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],17:[function(_dereq_,module,exports){
var $          = _dereq_('./$')
  , createDesc = _dereq_('./$.property-desc');
module.exports = _dereq_('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":25,"./$.descriptors":11,"./$.property-desc":28}],18:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":7}],19:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":7}],20:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],21:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./$')
  , descriptor     = _dereq_('./$.property-desc')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./$.hide')(IteratorPrototype, _dereq_('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":25,"./$.hide":17,"./$.property-desc":28,"./$.set-to-string-tag":30,"./$.wks":34}],22:[function(_dereq_,module,exports){
'use strict';
var LIBRARY         = _dereq_('./$.library')
  , $def            = _dereq_('./$.def')
  , $redef          = _dereq_('./$.redef')
  , hide            = _dereq_('./$.hide')
  , has             = _dereq_('./$.has')
  , SYMBOL_ITERATOR = _dereq_('./$.wks')('iterator')
  , Iterators       = _dereq_('./$.iterators')
  , $iterCreate     = _dereq_('./$.iter-create')
  , setToStringTag  = _dereq_('./$.set-to-string-tag')
  , getProto        = _dereq_('./$').getProto
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if((!LIBRARY || FORCE) && (BUGGY || !(SYMBOL_ITERATOR in proto))){
    hide(proto, SYMBOL_ITERATOR, _default);
  }
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : getMethod(VALUES),
      keys:    IS_SET            ? _default : getMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : getMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
  return methods;
};
},{"./$":25,"./$.def":9,"./$.has":16,"./$.hide":17,"./$.iter-create":21,"./$.iterators":24,"./$.library":27,"./$.redef":29,"./$.set-to-string-tag":30,"./$.wks":34}],23:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],24:[function(_dereq_,module,exports){
module.exports = {};
},{}],25:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],26:[function(_dereq_,module,exports){
var $         = _dereq_('./$')
  , toIObject = _dereq_('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":25,"./$.to-iobject":32}],27:[function(_dereq_,module,exports){
module.exports = false;
},{}],28:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],29:[function(_dereq_,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = _dereq_('./$.global')
  , hide      = _dereq_('./$.hide')
  , SRC       = _dereq_('./$.uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

_dereq_('./$.core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./$.core":8,"./$.global":15,"./$.hide":17,"./$.uid":33}],30:[function(_dereq_,module,exports){
var def = _dereq_('./$').setDesc
  , has = _dereq_('./$.has')
  , TAG = _dereq_('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":25,"./$.has":16,"./$.wks":34}],31:[function(_dereq_,module,exports){
var global = _dereq_('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":15}],32:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./$.iobject')
  , defined = _dereq_('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":10,"./$.iobject":18}],33:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],34:[function(_dereq_,module,exports){
var store  = _dereq_('./$.shared')('wks')
  , uid    = _dereq_('./$.uid')
  , Symbol = _dereq_('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":15,"./$.shared":31,"./$.uid":33}],35:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./$.add-to-unscopables')
  , step             = _dereq_('./$.iter-step')
  , Iterators        = _dereq_('./$.iterators')
  , toIObject        = _dereq_('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":4,"./$.iter-define":22,"./$.iter-step":23,"./$.iterators":24,"./$.to-iobject":32}],36:[function(_dereq_,module,exports){
// 20.2.2.34 Math.trunc(x)
var $def = _dereq_('./$.def');

$def($def.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./$.def":9}],37:[function(_dereq_,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = _dereq_('./$.classof')
  , test    = {};
test[_dereq_('./$.wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  _dereq_('./$.redef')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./$.classof":6,"./$.redef":29,"./$.wks":34}],38:[function(_dereq_,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = _dereq_('./$')
  , global         = _dereq_('./$.global')
  , has            = _dereq_('./$.has')
  , DESCRIPTORS    = _dereq_('./$.descriptors')
  , $def           = _dereq_('./$.def')
  , $redef         = _dereq_('./$.redef')
  , $fails         = _dereq_('./$.fails')
  , shared         = _dereq_('./$.shared')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , uid            = _dereq_('./$.uid')
  , wks            = _dereq_('./$.wks')
  , keyOf          = _dereq_('./$.keyof')
  , $names         = _dereq_('./$.get-names')
  , enumKeys       = _dereq_('./$.enum-keys')
  , isArray        = _dereq_('./$.is-array')
  , anObject       = _dereq_('./$.an-object')
  , toIObject      = _dereq_('./$.to-iobject')
  , createDesc     = _dereq_('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !_dereq_('./$.library')){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $def($def.S + $def.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":25,"./$.an-object":5,"./$.def":9,"./$.descriptors":11,"./$.enum-keys":12,"./$.fails":13,"./$.get-names":14,"./$.global":15,"./$.has":16,"./$.is-array":19,"./$.keyof":26,"./$.library":27,"./$.property-desc":28,"./$.redef":29,"./$.set-to-string-tag":30,"./$.shared":31,"./$.to-iobject":32,"./$.uid":33,"./$.wks":34}],39:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _shareUtils = _dereq_('./share-utils');

var _shareUtils2 = _interopRequireDefault(_shareUtils);

/**
 * Sharebutton
 * @class
 * @classdesc
 * @extends ShareUtils

 * @param {String} element
 * @param {Object} options
 */
_dereq_('core-js/fn/symbol');
_dereq_('core-js/fn/array/iterator');
_dereq_('core-js/fn/math/trunc');

var ShareButton = (function (_ShareUtils) {
  _inherits(ShareButton, _ShareUtils);

  function ShareButton(element, options) {
    _classCallCheck(this, ShareButton);

    _get(Object.getPrototypeOf(ShareButton.prototype), 'constructor', this).call(this);

    if (typeof element === 'object') {
      this.element = undefined;
      options = element;
    } else this.element = element;

    this.el = {
      head: document.getElementsByTagName('head')[0],
      body: document.getElementsByTagName('body')[0]
    };

    this.config = {
      enabledNetworks: 0,
      protocol: '//',
      url: window.location.href,
      caption: null,
      title: this._defaultTitle(),
      image: this._defaultImage(),
      description: this._defaultDescription(),

      ui: {
        flyout: 'sb-top sb-center',
        buttonText: 'Share',
        namespace: 'sb-',
        networkOrder: [],
        collision: false
      },

      networks: {
        googlePlus: {
          enabled: true,
          url: null
        },
        twitter: {
          enabled: true,
          url: null,
          description: null
        },
        facebook: {
          enabled: true,
          loadSdk: true,
          url: null,
          appId: null,
          title: null,
          caption: null,
          description: null,
          image: null
        },
        pinterest: {
          enabled: true,
          url: null,
          image: null,
          description: null
        },
        reddit: {
          enabled: true,
          url: null,
          title: null
        },
        linkedin: {
          enabled: true,
          url: null,
          title: null,
          description: null
        },
        whatsapp: {
          enabled: true,
          description: null,
          url: null
        },
        email: {
          enabled: true,
          title: null,
          description: null
        },
        'kakaotalk': {
          enabled: true,
          url: null,
          title: null,
          description: null,
          loadSdk: true,
          appKey: null
        },
        'kakaostory': {
          enabled: true,
          url: null,
          title: null,
          description: null,
          loadSdk: true,
          appKey: null
        },
        'naverline': {
          enabled: true,
          url: null,
          title: null,
          description: null
        },
        'naverband': {
          enabled: true,
          url: null,
          title: null,
          description: null,
          appStore: 'itms-apps://itunes.apple.com/app/id542613198?mt=8',
          appProto: 'bandapp://',
          googleStore: 'market://details?id=com.nhn.android.band',
          googleProto: 'scheme=bandapp;package=com.nhn.android.band'
        },
        'naverblog': {
          enabled: true,
          url: null,
          title: null,
          description: null
        }
      }
    };

    this.listener = null;
    this._setup(this.element, options);
  }

  /**
   * @method open
   * @description Opens Share Button
   */

  _createClass(ShareButton, [{
    key: 'open',
    value: function open() {
      this._public('Open');
    }

    /**
     * @method close
     * @description Cpens Share Button
     */
  }, {
    key: 'close',
    value: function close() {
      this._public('Close');
    }

    /**
     * @method toggle
     * @description Toggles Share Button
     */
  }, {
    key: 'toggle',
    value: function toggle() {
      this._public('Toggle');
    }

    /**
     * @method toggleListen
     * @description Toggles the Share Button listener, good for updaing share
     * button for CSS animations.
     */
  }, {
    key: 'toggleListen',
    value: function toggleListen() {
      this._public('Listen');
    }

    /**
     * @method _public
     * @description Executes action
     * @private
     *
     * @param {String} action
     */
  }, {
    key: '_public',
    value: function _public(action) {
      var instances = undefined;

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, document.getElementsByTagName('share-button'));else instances = document.querySelectorAll(element);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = instances[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var instance = _step.value;

          var networks = instance.getElementsByClassName(this.config.ui.namespace + 'social')[0];
          this['_event' + action](instance, networks);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @method _setup
     * @description Sets up Share Button
     * @private
     *
     * @param {String} element selector
     * @param {Object} opts
     */
  }, {
    key: '_setup',
    value: function _setup(element, opts) {
      var instances = undefined;

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, document.getElementsByTagName('share-button'));else {
        instances = document.querySelectorAll('share-button' + element);
        if (typeof instances === 'object') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, instances);
      }

      // Adding user configs to default configs
      this._merge(this.config, opts);

      // Disable whatsapp, kakaotalk, naverline, naverband display if not a mobile device
      if (!this._isMobile()) {
        if (this.config.networks.whatsapp.enabled) this.config.networks.whatsapp.enabled = false;

        if (this.config.networks.kakaotalk.enabled) this.config.networks.kakaotalk.enabled = false;

        if (this.config.networks.naverline.enabled) this.config.networks.naverline.enabled = false;

        if (this.config.networks.naverband.enabled) this.config.networks.naverband.enabled = false;
      }

      // Default order of networks if no network order entered
      if (this.config.ui.networkOrder.length === 0) this.config.ui.networkOrder = ['pinterest', 'twitter', 'facebook', 'whatsapp', 'googlePlus', 'reddit', 'linkedin', 'email', 'kakaotalk', 'kakaostory', 'naverline', 'naverband', 'naverblog'];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(this.config.networks)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var network = _step2.value;

          if (this.config.ui.networkOrder.indexOf(network.toString()) < 0) {
            this.config.networks[network].enabled = false;
            this.config.ui.networkOrder.push(network);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._fixFlyout();
      this._detectNetworks();
      this._normalizeNetworkConfiguration();

      // Inject Facebook JS SDK (if Facebook is enabled)
      if (this.config.networks.facebook.enabled && this.config.networks.facebook.loadSdk) this._injectFacebookSdk();

      // Inject Kakao JS SDK (if Kakao is enabled)
      if (this.config.networks.kakaotalk.enabled && this.config.networks.kakaotalk.loadSdk || this.config.networks.kakaostory.enabled && this.config.networks.kakaostory.loadSdk) this._injectKakaoSdk();

      // Initialize instances
      var index = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = instances[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var instance = _step3.value;

          this._setupInstance(instance, index++);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /**
     * @method _setupInstance
     * @description Sets up each instance with config and styles
     * @private
     *
     * @param {DOMNode} element
     * @param {Integer} index
     */
  }, {
    key: '_setupInstance',
    value: function _setupInstance(instance, index) {
      var _this = this;

      this._hide(instance);

      // Add necessary classes to instance
      // (Note: FF doesn't support adding multiple classes in a single call)
      this._addClass(instance, 'sharer-' + index);
      this._injectHtml(instance);
      this._show(instance);

      var networksCon = instance.getElementsByClassName(this.config.ui.namespace + 'social')[0];
      var networks = instance.getElementsByTagName('li');

      this._addClass(networksCon, 'networks-' + this.config.enabledNetworks);
      instance.addEventListener('click', function () {
        return _this._eventToggle(instance, networksCon);
      });

      // Add listener to activate networks and close button

      var _loop = function (k) {
        var network = networks[k];

        if (typeof network !== "undefined") {
          (function () {
            var name = network.getAttribute('data-network');
            var a = network.getElementsByTagName('a')[0];

            _this._addClass(network, _this.config.networks[name]['class']);

            if (network.className !== 'email') a.setAttribute('onclick', 'return false');

            a.addEventListener('mousedown', function () {
              _this._hook('before', name, instance);
            });
            a.addEventListener('mouseup', function () {
              _this['_network' + name.capFLetter()](network);
            });
            a.addEventListener('click', function () {
              _this._hook('after', name, instance);
            });
          })();
        }
      };

      for (var k in Object.keys(networks)) {
        _loop(k);
      }
    }

    /**
     * @method _eventToggle
     * @description Toggles 'active' class on button
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     */
  }, {
    key: '_eventToggle',
    value: function _eventToggle(button, networks) {
      if (this._hasClass(networks, 'active')) this._eventClose(networks);else this._eventOpen(button, networks);
    }

    /**
     * @method _eventOpen
     * @description Add 'active' class & remove 'load' class on button
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     */
  }, {
    key: '_eventOpen',
    value: function _eventOpen(button, networks) {
      if (this._hasClass(networks, 'load')) this._removeClass(networks, 'load');
      if (this.collision) this._collisionDetection(button, networks);

      this._addClass(networks, 'active');
    }

    /**
     * @method _eventClose
     * @description Remove 'active' class on button
     * @private
     *
     * @param {DOMNode} button
     */
  }, {
    key: '_eventClose',
    value: function _eventClose(button) {
      this._removeClass(button, 'active');
    }

    /**
     * @method _eventListen
     * @description Toggles weather or not a button's classes are being
     * constantly updated regardless of scrolls or window resizes.
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     */
  }, {
    key: '_eventListen',
    value: function _eventListen(button, networks) {
      var _this2 = this;

      var dimensions = this._getDimensions(button, networks);
      if (this.listener === null) this.listener = window.setInterval(function () {
        return _this2._adjustClasses(button, networks, dimensions);
      }, 100);else {
        window.clearInterval(this.listener);
        this.listener = null;
      }
    }

    /**
     * @method _fixFlyout
     * @description Fixes the flyout entered by the user to match their provided
     * namespace
     *@private
     */
  }, {
    key: '_fixFlyout',
    value: function _fixFlyout() {
      var flyouts = this.config.ui.flyout.split(' ');
      if (flyouts[0].substring(0, this.config.ui.namespace.length) !== this.config.ui.namespace) flyouts[0] = '' + this.config.ui.namespace + flyouts[0];
      if (flyouts[1].substring(0, this.config.ui.namespace.length) !== this.config.ui.namespace) flyouts[1] = '' + this.config.ui.namespace + flyouts[1];
      this.config.ui.flyout = flyouts.join(' ');
    }

    /**
     * @method _collisionDetection
     * @description Adds listeners the first time a button is clicked to call
     * this._adjustClasses during scrolls and resizes.
     * @private
     *
     * @param {DOMNode} button - share button
     * @param {DOMNode} networks - list of social networks
     */
  }, {
    key: '_collisionDetection',
    value: function _collisionDetection(button, networks) {
      var _this3 = this;

      var dimensions = this._getDimensions(button, networks);
      this._adjustClasses(button, networks, dimensions);

      if (!button.classList.contains('clicked')) {
        window.addEventListener('scroll', function () {
          return _this3._adjustClasses(button, dimensions);
        });
        window.addEventListener('resize', function () {
          return _this3._adjustClasses(button, dimensions);
        });
        button.classList.add('clicked');
      }
    }

    /**
     * @method _getDimensions
     * @description Returns an object with the dimensions of the button and
     * label elements of a Share Button.
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     * @returns {Object}
     */
  }, {
    key: '_getDimensions',
    value: function _getDimensions(button, networks) {
      return {
        networksWidth: networks.offsetWidth,
        buttonHeight: button.offsetHeight,
        buttonWidth: button.offsetWidth
      };
    }

    /**
     * @method _adjustClasses
     * @description Adjusts the positioning of the list of social networks based
     * off of where the share button is relative to the window.
     *
     * @private
     * @param {DOMNode} button
     * @param {DOMNode} label
     * @param {Object} dimensions
     */
  }, {
    key: '_adjustClasses',
    value: function _adjustClasses(button, networks, dimensions) {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var leftOffset = button.getBoundingClientRect().left + dimensions.buttonWidth / 2;
      var rightOffset = windowWidth - leftOffset;
      var topOffset = button.getBoundingClientRect().top + dimensions.buttonHeight / 2;
      var position = this._findLocation(leftOffset, topOffset, windowWidth, windowHeight);

      if (position[1] === "middle" && position[0] !== "center" && (position[0] === "left" && windowWidth <= leftOffset + 220 + dimensions.buttonWidth / 2 || position[0] === "right" && windowWidth <= rightOffset + 220 + dimensions.buttonWidth / 2)) {
        networks.classList.add(this.config.ui.namespace + 'top');
        networks.classList.remove(this.config.ui.namespace + 'middle');
        networks.classList.remove(this.config.ui.namespace + 'bottom');
      } else {
        switch (position[0]) {
          case "left":
            networks.classList.add(this.config.ui.namespace + 'right');
            networks.classList.remove(this.config.ui.namespace + 'center');
            networks.classList.remove(this.config.ui.namespace + 'left');
            break;
          case "center":
            if (position[1] !== "top") networks.classList.add(this.config.ui.namespace + 'top');
            networks.classList.add(this.config.ui.namespace + 'center');
            networks.classList.remove(this.config.ui.namespace + 'left');
            networks.classList.remove(this.config.ui.namespace + 'right');
            networks.classList.remove(this.config.ui.namespace + 'middle');
            break;
          case "right":
            networks.classList.add(this.config.ui.namespace + 'left');
            networks.classList.remove(this.config.ui.namespace + 'center');
            networks.classList.remove(this.config.ui.namespace + 'right');
            break;
        }
        switch (position[1]) {
          case "top":
            networks.classList.add(this.config.ui.namespace + 'bottom');
            networks.classList.remove(this.config.ui.namespace + 'middle');
            if (position[0] !== "center") networks.classList.remove(this.config.ui.namespace + 'top');
            break;
          case "middle":
            if (position[0] !== "center") {
              networks.classList.add(this.config.ui.namespace + 'middle');
              networks.classList.remove(this.config.ui.namespace + 'top');
            }
            networks.classList.remove(this.config.ui.namespace + 'bottom');
            break;
          case "bottom":
            networks.classList.add(this.config.ui.namespace + 'top');
            networks.classList.remove(this.config.ui.namespace + 'middle');
            networks.classList.remove(this.config.ui.namespace + 'bottom');
            break;
        }
      }
    }

    /**
     * @method _findLocation
     * @description Finds the location of the label given by its x and y value
     * with respect to the window width and window height given.
     * @private
     *
     * @param {number} labelX
     * @param {number} labelY
     * @param {number} windowWidth
     * @param {number} windowHeight
     * @returns {Array}
     */
  }, {
    key: '_findLocation',
    value: function _findLocation(labelX, labelY, windowWidth, windowHeight) {
      var xPosition = ["left", "center", "right"];
      var yPosition = ["top", "middle", "bottom"];
      var xLocation = Math.trunc(3 * (1 - (windowWidth - labelX) / windowWidth));
      var yLocation = Math.trunc(3 * (1 - (windowHeight - labelY) / windowHeight));
      if (xLocation >= 3) xLocation = 2;else if (xLocation <= -1) xLocation = 0;
      if (yLocation >= 3) yLocation = 2;else if (yLocation <= -1) yLocation = 0;
      return [xPosition[xLocation], yPosition[yLocation]];
    }

    /**
     * @method _networkFacebook
     * @description Create & display a Facebook window
     * @private
     */
  }, {
    key: '_networkFacebook',
    value: function _networkFacebook(element) {
      if (this.config.networks.facebook.loadSdk) {
        if (!window.FB) return console.error('The Facebook JS SDK hasn\'t loaded yet.');
        this._updateHref(element, 'https://www.facebook.com/sharer/sharer.php', {
          u: this.config.networks.facebook.url
        });
        return FB.ui({
          method: 'feed',
          name: this.config.networks.facebook.title,
          link: this.config.networks.facebook.url,
          picture: this.config.networks.facebook.image,
          caption: this.config.networks.facebook.caption,
          description: this.config.networks.facebook.description
        });
      } else return this._updateHref(element, 'https://www.facebook.com/sharer/sharer.php', {
        u: this.config.networks.facebook.url
      });
    }

    /**
     * @method _networkTwitter
     * @description Create & display a Twitter window
     * @private
     */
  }, {
    key: '_networkTwitter',
    value: function _networkTwitter(element) {
      this._updateHref(element, 'https://twitter.com/intent/tweet', {
        text: this.config.networks.twitter.description,
        url: this.config.networks.twitter.url
      });
    }

    /**
     * @method _networkGooglePlus
     * @description Create & display a Google Plus window
     * @private
     */
  }, {
    key: '_networkGooglePlus',
    value: function _networkGooglePlus(element) {
      this._updateHref(element, 'https://plus.google.com/share', {
        url: this.config.networks.googlePlus.url
      });
    }

    /**
     * @method _networkPinterest
     * @description Create & display a Pinterest window
     * @private
     */
  }, {
    key: '_networkPinterest',
    value: function _networkPinterest(element) {
      this._updateHref(element, 'https://www.pinterest.com/pin/create/button', {
        url: this.config.networks.pinterest.url,
        media: this.config.networks.pinterest.image,
        description: this.config.networks.pinterest.description
      });
    }

    /**
     * @method _networkLinkedIn
     * @description Create & display a Linkedin window
     * @private
     */
  }, {
    key: '_networkLinkedin',
    value: function _networkLinkedin(element) {
      this._updateHref(element, 'https://www.linkedin.com/shareArticle', {
        mini: 'true',
        url: this.config.networks.linkedin.url,
        title: this.config.networks.linkedin.title,
        summary: this.config.networks.linkedin.description
      });
    }

    /**
     * @method _networkEmail
     * @description Create & display an Email window
     * @private
     */
  }, {
    key: '_networkEmail',
    value: function _networkEmail(element) {
      this._updateHref(element, 'mailto:', {
        subject: this.config.networks.email.title,
        body: this.config.networks.email.description
      });
    }

    /**
     * @method _networkReddit
     * @description Create & display a Reddit window
     * @private
     */
  }, {
    key: '_networkReddit',
    value: function _networkReddit(element) {
      this._updateHref(element, 'http://www.reddit.com/submit', {
        url: this.config.networks.reddit.url,
        title: this.config.networks.reddit.title
      });
    }

    /**
     * @method _networkWhatsapp
     * @description Create & display a Whatsapp window
     * @private
     */
  }, {
    key: '_networkWhatsapp',
    value: function _networkWhatsapp(element) {
      this._updateHref(element, 'whatsapp://send', {
        text: this.config.networks.whatsapp.description + " " + this.config.networks.whatsapp.url
      });
    }

    /**
     * @method _networkKakaoTalk
     * @description Create & display a KakaoTalk window
     * @private
     */
  }, {
    key: '_networkKakaotalk',
    value: function _networkKakaotalk(element) {
      if (this.config.networks.kakaotalk.loadSdk && window.Kakao) {
        return Kakao.Link.sendTalkLink({
          label: this.config.networks.kakaotalk.description,
          webLink: {
            text: this.config.networks.kakaotalk.title,
            url: this.config.networks.kakaotalk.url
          }
        });
      } else return console.error('The Kakao JS SDK hasn\'t loaded yet.');
    }

    /**
     * @method _networkKakaoStory
     * @description Create & display a KakaoStory window
     * @private
     */
  }, {
    key: '_networkKakaostory',
    value: function _networkKakaostory(element) {
      if (this.config.networks.kakaostory.loadSdk) {
        if (!window.Kakao) {
          this._updateHref(element, 'https://story.kakao.com/s/share', {
            url: this.config.networks.kakaostory.url,
            text: this.config.networks.kakaostory.description
          });
          return console.error('The Kakao JS SDK hasn\'t loaded yet.');
        }
        return Kakao.Story.share({
          url: this.config.networks.kakaostory.url,
          text: this.config.networks.kakaostory.description
        });
      } else return this._updateHref(element, 'https://story.kakao.com/s/share', {
        url: this.config.networks.kakaostory.url,
        text: this.config.networks.kakaostory.description
      });
    }

    /**
     * @method _networkNaverline
     * @description Create & display a Naverline window
     * @private
     */
  }, {
    key: '_networkNaverline',
    value: function _networkNaverline(element) {
      this._updateHref(element, 'http://line.naver.jp/R/msg/text/?' + this.config.networks.naverline.description + encodeURIComponent('\r\n') + this.config.networks.naverline.url, {});
    }

    /**
      * @method _networkNaverband
      * @description Create & display a Naverline window
      * @private
      */
  }, {
    key: '_networkNaverband',
    value: function _networkNaverband(element) {
      var config = this.config.networks.naverband;
      var text = config.description + encodeURIComponent('\r\n') + config.url;

      if (navigator.userAgent.match(/android/i)) {
        return this._updateHref(element, 'intent://create/post?text=' + text + '#Intent;' + config.googleProto + ';end');
      } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
        setTimeout(function () {
          window.location = config.appStore;
        }, 100);
        return this._updateHref(element, config.appProto + 'create/post?text=' + text);
      }
    }

    /**
      * @method _networkNaverblog
      * @description Create & display a Naverline window
      * @private
      */
  }, {
    key: '_networkNaverblog',
    value: function _networkNaverblog(element) {
      this._updateHref(element, 'http://blog.naver.com/openapi/share', {
        url: this.config.networks.naverblog.url,
        title: this.config.networks.naverblog.description
      });
    }

    /**
     * @method _injectStylesheet
     * @description Inject link to stylesheet
     * @private
     *
     * @param {String} url
     */
  }, {
    key: '_injectStylesheet',
    value: function _injectStylesheet(url) {
      if (!this.el.head.querySelector('link[href=\'' + url + '\']')) {
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", url);
        this.el.head.appendChild(link);
      }
    }

    /**
     * @method _injectHtml
     * @description Inject button structure
     * @private
     *
     * @param {DOMNode} instance
     */
  }, {
    key: '_injectHtml',
    value: function _injectHtml(instance) {
      var networks = this.config.ui.networkOrder;
      var networkList = '';

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = networks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var network = _step4.value;

          networkList += '<li class=\'' + network + '\' data-network=\'' + network + '\'><a></a></li>';
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      instance.innerHTML = this.config.ui.buttonText + '<div class=\'' + this.config.ui.namespace + 'social load ' + this.config.ui.flyout + '\'><ul>' + networkList + '</ul></div>';
    }

    /**
     * @method _injectFacebookSdk
     * @description Inject Facebook SDK
     * @private
     */
  }, {
    key: '_injectFacebookSdk',
    value: function _injectFacebookSdk() {
      if (!window.FB && this.config.networks.facebook.appId && !this.el.body.querySelector('#fb-root')) {
        var script = document.createElement('script');
        script.text = 'window.fbAsyncInit=function(){FB.init({appId:\'' + this.config.networks.facebook.appId + '\',status:true,xfbml:true})};(function(e,t,n){var r,i=e.getElementsByTagName(t)[0];if (e.getElementById(n)){return}r=e.createElement(t);r.id=n;r.src=\'//connect.facebook.net/en_US/all.js\';i.parentNode.insertBefore(r,i)})(document,\'script\',\'facebook-jssdk\');';

        var fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';

        this.el.body.appendChild(fbRoot);
        this.el.body.appendChild(script);
      }
    }
  }, {
    key: '_injectKakaoSdk',
    value: function _injectKakaoSdk() {
      if (!window.Kakao && this.config.networks.kakaotalk.appKey) {
        var script = document.createElement('script');

        script.text = '!function(a,e){e=a.createElement("script"),e.type="text/javascript",e.async=!0,e.onload=function(){Kakao.init(\'' + this.config.networks.kakaotalk.appKey + '\')},e.src="https://developers.kakao.com/sdk/js/kakao.min.js",a.getElementsByTagName("head")[0].appendChild(e)}(document)';

        this.el.body.appendChild(script);
      }
    }

    /**
     * @method _hook
     * @description Hook helper function
     * @private
     *
     * @param {String}   type
     * @param {String}   network
     * @param {DOMNode}  instance
     */
  }, {
    key: '_hook',
    value: function _hook(type, network, instance) {
      var fn = this.config.networks[network][type];

      if (typeof fn === 'function') {
        var opts = fn.call(this.config.networks[network], instance);

        if (opts !== undefined) {
          opts = this._normalizeFilterConfigUpdates(opts);
          this.extend(this.config.networks[network], opts, true);
          this._normalizeNetworkConfiguration();
        }
      }
    }

    /**
     * @method _defaultTitle
     * @description Gets default title
     * @private
     *
     * @returns {String}
     */
  }, {
    key: '_defaultTitle',
    value: function _defaultTitle() {
      var content = undefined;
      if (content = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="twitter:title"]')) return content.getAttribute('content');else if (content = document.querySelector('title')) return content.textContent || content.innerText;
    }

    /**
     * @method _defaultImage
     * @description Gets default image
     * @private
     *
     * @returns {String}
     */
  }, {
    key: '_defaultImage',
    value: function _defaultImage() {
      var content = undefined;
      if (content = document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]')) return content.getAttribute('content');
    }

    /**
     * @method _defaultDescription
     * @description Gets default description
     * @private
     *
     * @returns {String}
     */
  }, {
    key: '_defaultDescription',
    value: function _defaultDescription() {
      var content = undefined;
      if (content = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="twitter:description"]') || document.querySelector('meta[name="description"]')) return content.getAttribute('content');else return '';
    }

    /**
     * @method _detectNetworks
     * @description Detect number of networks in use and display/hide
     * @private
     */
  }, {
    key: '_detectNetworks',
    value: function _detectNetworks() {
      // Update network-specific configuration with global configurations
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.keys(this.config.networks)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var network = _step5.value;

          var display = undefined;
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = Object.keys(this.config.networks[network])[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var option = _step6.value;

              if (this.config.networks[network][option] === null) {
                this.config.networks[network][option] = this.config[option];
              }
            }

            // Check for enabled networks and display them
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                _iterator6['return']();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          if (this.config.networks[network].enabled) {
            this['class'] = 'enabled';
            this.config.enabledNetworks += 1;
          } else this['class'] = 'disabled';

          this.config.networks[network]['class'] = this['class'];
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
            _iterator5['return']();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }

    /**
     * @method _normalizeNetworkConfiguration
     * @description Normalizes network configuration for Facebook & Twitter
     * @private
     */
  }, {
    key: '_normalizeNetworkConfiguration',
    value: function _normalizeNetworkConfiguration() {
      // Don't load FB SDK if FB appId isn't present
      if (!this.config.networks.facebook.appId) this.config.networks.facebook.loadSdk = false;

      // Encode Twitter description for URL
      if (!!this.config.networks.twitter.description) if (!this._isEncoded(this.config.networks.twitter.description)) this.config.networks.twitter.description = encodeURIComponent(this.config.networks.twitter.description);

      // Typecast Facebook appId to a String
      if (typeof this.config.networks.facebook.appId === 'number') this.config.networks.facebook.appId = this.config.networks.facebook.appId.toString();
    }

    /**
     * @method _normalizeFilterConfigUpdates
     * @description Normalizes Facebook config
     * @private
     *
     * @param {Object} opts
     * @returns {Object}
     */
  }, {
    key: '_normalizeFilterConfigUpdates',
    value: function _normalizeFilterConfigUpdates(opts) {
      if (this.config.networks.facebook.appId !== opts.appId) {
        console.warn('You are unable to change the Facebook appId after the button has been initialized. Please update your Facebook filters accordingly.');
        delete opts.appId;
      }

      if (this.config.networks.facebook.loadSdk !== opts.loadSdk) {
        console.warn('You are unable to change the Facebook loadSdk option after the button has been initialized. Please update your Facebook filters accordingly.');
        delete opts.appId;
      }

      return opts;
    }
  }]);

  return ShareButton;
})(_shareUtils2['default']);

module.exports = ShareButton;

},{"./share-utils":40,"core-js/fn/array/iterator":1,"core-js/fn/math/trunc":2,"core-js/fn/symbol":3}],40:[function(_dereq_,module,exports){
/**
 * ShareUtils
 * @class
 * @classdesc A nice set of utilities.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShareUtils = (function () {
  function ShareUtils() {
    _classCallCheck(this, ShareUtils);
  }

  /**
   * @method toRFC3986
   * @description Encodes the string in RFC3986
   * @memberof String
   *
   * @return {String}
   */

  _createClass(ShareUtils, [{
    key: "_getStyle",
    value: function _getStyle(ele, css) {
      var strValue = "";

      if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(ele, "").getPropertyValue(css);
      } else if (ele.currentStyle) {
        css = css.replace(/\-(\w)/g, function (strMatch, p1) {
          return p1.toUpperCase();
        });
        strValue = ele.currentStyle[css];
      }

      return strValue;
    }

    /**
     * @method _hide
     * @description Change element's display to 'none'
     * @private
     *
     * @param {DOMNode} el
     */
  }, {
    key: "_hide",
    value: function _hide(el) {
      el.style.display = "none";
    }

    /**
     * @method _show
     * @description Change element's display to 'block'
     * @private
     *
     * @param {DOMNode} el
     */
  }, {
    key: "_show",
    value: function _show(el) {
      el.style.display = "initial";
    }

    /**
     * @method _hasClass
     * @description Wrapper to see if an element contains a class.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     * @returns {Boolean}
     */
  }, {
    key: "_hasClass",
    value: function _hasClass(el, className) {
      return el.classList.contains(className);
    }

    /**
     * @method addClass
     * @description Wrapper to add class to element.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     */
  }, {
    key: "_addClass",
    value: function _addClass(el, className) {
      el.classList.add(className);
    }

    /**
     * @method removeClass
     * @description Wrapper to remove class from element.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     */
  }, {
    key: "_removeClass",
    value: function _removeClass(el, className) {
      el.classList.remove(className);
    }

    /**
     * @method _isEncoded
     * @description Wrapper to check if the string is encoded.
     * @private
     *
     * @param {String}  str
     * @param {Boolean}
     */
  }, {
    key: "_isEncoded",
    value: function _isEncoded(str) {
      str = str.toRFC3986();
      return decodeURIComponent(str) !== str;
    }

    /**
     * @method _encode
     * @description Wrapper to _encode a string if the string isn't already encoded.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     */
  }, {
    key: "_encode",
    value: function _encode(str) {
      if (typeof str === 'undefined' || str === null || this._isEncoded(str)) return encodeURIComponent(str);else return str.toRFC3986();
    }

    /**
     * @method _getUrl
     * @description Returns the correct share URL based off of the incoming
     * URL and parameters given
     * @private
     *
     * @param {String} url
     * @param {boolean} encode
     * @param {Object} params
     */
  }, {
    key: "_getUrl",
    value: function _getUrl(url) {
      var _this = this;

      var encode = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var qs = (function () {
        var results = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(params)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var k = _step.value;

            var v = params[k];
            results.push(k + "=" + _this._encode(v));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return results.join('&');
      })();

      if (qs) qs = "?" + qs;

      return url + qs;
    }

    /**
     * @method _updateHref
     * @description Makes the elements a tag have a href of the popup link and
     * as pops up the share window for the element
     * @private
     *
     * @param {DOMNode} element
     * @param {String} url
     * @param {Object} params
     */
  }, {
    key: "_updateHref",
    value: function _updateHref(element, url, params) {
      var encode = url.indexOf('mailto:') >= 0;
      var a = element.getElementsByTagName('a')[0];
      a.setAttribute('href', this._getUrl(url, !encode, params));
      if (!encode && (!this.config.networks.facebook.loadSdk || element.getAttribute('class') !== 'facebook')) {
        var popup = {
          width: 500,
          height: 350
        };

        popup.top = screen.height / 2 - popup.height / 2;
        popup.left = screen.width / 2 - popup.width / 2;

        window.open(a.href, 'targetWindow', "\n          toolbar=no,\n          location=no,\n          status=no,\n          menubar=no,\n          scrollbars=yes,\n          resizable=yes,\n          left=" + popup.left + ",\n          top=" + popup.top + ",\n          width=" + popup.width + ",\n          height=" + popup.height + "\n        ");
      }
    }

    /**
     * @method popup
     * @description Create a window for specified network
     *
     * @param {String}  url
     * @param {Object}  params
     */
  }, {
    key: "popup",
    value: function popup(url) {
      var _this2 = this;

      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var popup = {
        width: 500,
        height: 350
      };

      popup.top = screen.height / 2 - popup.height / 2;
      popup.left = screen.width / 2 - popup.width / 2;

      var qs = (function () {
        var results = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(params)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            var v = params[k];
            results.push(k + "=" + _this2._encode(v));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return results.join('&');
      })();

      if (qs) qs = "?" + qs;

      // This does work even though it contains \n once converted.
      window.open(url + qs, 'targetWindow', "\n        toolbar=no,\n        location=no,\n        status=no,\n        menubar=no,\n        scrollbars=yes,\n        resizable=yes,\n        left=" + popup.left + ",\n        top=" + popup.top + ",\n        width=" + popup.width + ",\n        height=" + popup.height + "\n      ");
    }

    /**
     * @method _merge
     * @description Combines two (or more) objects, giving the last one precedence
     * @author svlasov-gists
     * [Original Gist]{@link https://gist.github.com/svlasov-gists/2383751}
     *
     * @param {Object}  target
     * @param {Object}  source
     * @return {Object} target
     */
  }, {
    key: "_merge",
    value: (function (_merge2) {
      function _merge(_x, _x2) {
        return _merge2.apply(this, arguments);
      }

      _merge.toString = function () {
        return _merge2.toString();
      };

      return _merge;
    })(function (target, source) {
      if (typeof target !== 'object') target = {};

      for (var property in source) {
        if (source.hasOwnProperty(property)) {
          var sourceProperty = source[property];

          if (typeof sourceProperty === 'object') {
            target[property] = this._merge(target[property], sourceProperty);
            continue;
          }

          target[property] = sourceProperty;
        }
      }

      for (var a = 2, l = arguments.length; a < l; a++) {
        _merge(target, arguments[a]);
      }return target;
    })

    /**
     * @method _objectToArray
     * @description Takes an Object and converts it into an array of Objects. This is used when converting a list of DOMNodes into an array.
     *
     * @param {Object} obj
     * @returns {Array} arr
     */
  }, {
    key: "_objToArray",
    value: function _objToArray(obj) {
      var arr = [];

      for (var k in obj) {
        if (typeof obj[k] === 'object') arr.push(obj[k]);
      }return arr;
    }

    /**
     * @method _isMobile
     * @description Returns true if current device is mobile (or PhantomJS for
     * testing purposes), and false otherwise
     * @author kriskbx
     * [Original Gist] {@link https://github.com/kriskbx/whatsapp-sharing/blob/master/src/button.js}
     * @private
     */
  }, {
    key: "_isMobile",
    value: function _isMobile() {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) return true;
      return false;
    }
  }]);

  return ShareUtils;
})();

String.prototype.toRFC3986 = function () {
  var tmp = encodeURIComponent(this);
  tmp.replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
};

/**
 * @method capFLetter
 * @description Does exactly what the method name states
 * @memberof String
 *
 * @return {String}
 */
String.prototype.capFLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

exports["default"] = ShareUtils;
module.exports = exports["default"];

},{}]},{},[39])
(39)
});