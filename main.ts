Object.prototype.mixins = function <T extends {
  [key: string]: any
}>(data: T) {
  const _this = this

  type ReturnType = typeof _this & typeof data

  const cloneObject: any = {}


  // # 先遍历源对象属性
  for (const key in _this) {
    const _key: keyof typeof _this = key as any
    if (Object.prototype.hasOwnProperty.call(_this, key)) {
      switch (typeof _this[_key]) {
        case 'undefined':
          continue
        case 'object':
          cloneObject[key] = {
            ...data[key],
            ..._this[_key]
          }
          continue
        case 'function':
          Object.defineProperty(cloneObject, _key, {
            value: () => {
              data[key](),
              (_this[_key] as Function)()
            }
          })
          continue
        default:
          cloneObject[key] = _this[_key]
      }
    }
  }

  // # 后遍历参数对象属性
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (!cloneObject[key]) cloneObject[key] = data[key]
    }
  }

  return cloneObject as ReturnType
}

function deepClone(obj = {}, hash = new WeakMap()) {
  if (!obj) return obj
  if (typeof obj !== 'object') return obj

  if (hash.has(obj)) return obj

  hash.set(obj, true)

  const clone = new (obj as any).constructor() as any

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key as keyof object], hash)
    }
  }

  return clone
}

const d = {
  a: 1,
  b: 2,
  c: 3,
  methods: {
    cat() { },
    map() { }
  },
  created(){
    console.log(this)
  }
}

const d2 = {
  b: 20,
  c: () => 1,
  fff: '妈的',
  methods: {
    add() { },
    reduce() { }
  },
  created(){
    console.log(this)
  }
}
const result = d.mixins(d2)