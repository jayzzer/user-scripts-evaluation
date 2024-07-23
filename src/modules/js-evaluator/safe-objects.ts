export const JS_SAFE_OBJECTS = [
  'Object',
  'Function',
  'Array',
  'Number',
  'parseFloat',
  'parseInt',
  'Infinity',
  'NaN',
  'undefined',
  'Boolean',
  'String',
  'Symbol',
  'Date',
  'RegExp',
  'Error',
  'JSON',
  'Math',
  'ArrayBuffer',
  'Map',
  'BigInt',
  'Set',
  'WeakMap',
  'WeakSet',
  'isFinite',
  'isNaN'
]

export const JS_DANGEROUS_OBJECTS = getAllGlobalObjects().filter(
  (objectName) => !JS_SAFE_OBJECTS.includes(objectName)
)

function getAllGlobalObjects() {
  const globalObjects = new Set<string>()

  let currentObject = self
  while (currentObject) {
    Object.getOwnPropertyNames(currentObject).forEach((property) => globalObjects.add(property))
    currentObject = Object.getPrototypeOf(currentObject)
  }

  return Array.from(globalObjects)
}
