module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "setupFiles": ["jest-canvas-mock"],
    globals: {
      'ts-jest': {
        // ...
        diagnostics: {
          ignoreCodes: [151001]
        }
      }
    }
  }